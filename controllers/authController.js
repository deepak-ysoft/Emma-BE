const { connectToDatabase } = require("../config/config");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const response = require("../common/response");
const { sendMail } = require("../common/sendMail");
const { getUserByEmail } = require("../helpers/userHelper");

// User Registration API
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { full_name, email, password, phone_number } = req.body;

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return response.DuplicateEmail(res);
    }

    // Connect to the database
    const pool = await connectToDatabase();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const userId = uuidv4();

    await pool
      .request()
      .input("Id", sql.UniqueIdentifier, userId)
      .input("FullName", sql.NVarChar(512), full_name)
      .input("Email", sql.NVarChar(256), email)
      .input("PasswordHash", sql.NVarChar(sql.MAX), hashedPassword)
      .input("PhoneNumber", sql.NVarChar(15), phone_number || null)
      .execute("RegisterUserV2");

    // Retrieve user data after registration
    const user = await getUserByEmail(email);
    if (!user) {
      return response.NotFound(res, "User not found after registration");
    }

    // Check payment status
    const paymentResult = await pool
      .request()
      .input("email", sql.NVarChar(255), email.toLowerCase())
      .query("SELECT email FROM paid_users WHERE email = @email");

    const hasPayment = paymentResult.recordset.length > 0;

    // Check onboarding status
    let isOnboarded = false;
    try {
      const onboardingResult = await pool
        .request()
        .input("userId", sql.NVarChar(450), user.Id)
        .execute("pwa_GetOnboardingData");
      isOnboarded = onboardingResult.recordset.length > 0;
    } catch (err) {
      if (err.number === 50012) {
        isOnboarded = false;
      } else {
        console.error("Error checking onboarding status:", err);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.Id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userDetails = {
      id: user.Id,
      user_name: user.UserName,
      email: user.Email,
      full_name: user.FullName,
      date_of_birth: user.DateOfBirth,
      isOnboarded: isOnboarded,
    };

    response.SuccessResponseWithData(res, "User registered successfully", {
      user: userDetails,
      token,
      payment: hasPayment, // Include payment status in response
    });
  } catch (err) {
    response.InternalServerError(res, err);
  }
};

// User Login API
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    // Retrieve the user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return response.NotFound(res, "User not found");
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isPasswordValid) {
      return response.FailedResponseWithOutData(res, "Invalid password");
    }

    // Check payment status
    const pool = await connectToDatabase();
    const paymentResult = await pool
      .request()
      .input("email", sql.NVarChar(255), email.toLowerCase())
      .query("SELECT email FROM paid_users WHERE email = @email");

    const hasPayment = paymentResult.recordset.length > 0;

    // Check onboarding status
    let isOnboarded = false;
    try {
      const onboardingResult = await pool
        .request()
        .input("userId", sql.NVarChar(450), user.Id)
        .execute("pwa_GetOnboardingData");

      isOnboarded = onboardingResult.recordset.length > 0;
    } catch (err) {
      if (err.number === 50012) {
        isOnboarded = false;
      } else {
        console.error("Error checking onboarding status:", err);
      }
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: user.Id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const refreshToken = jwt.sign(
      { userId: user.Id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "15d" }
    );

    // Store the refresh token in the database
    await pool
      .request()
      .input("Id", sql.UniqueIdentifier, uuidv4())
      .input("UserId", sql.NVarChar, user.Id)
      .input("Token", sql.NVarChar, refreshToken)
      .query(
        "INSERT INTO RefreshTokens (Id, UserId, Token) VALUES (@Id, @UserId, @Token)"
      );

    const userDetails = {
      id: user.Id,
      user_name: user.UserName,
      email: user.Email,
      first_name: user.FirstName,
      last_name: user.LastName,
      full_name: user.FullName,
      date_of_birth: user.DateOfBirth,
      isOnboarded: isOnboarded,
    };

    response.SuccessResponseWithData(res, "Login successful", {
      user: userDetails,
      accessToken,
      refreshToken,
      payment: hasPayment, // Include payment status in response
    });
  } catch (err) {
    response.InternalServerError(res, err);
  }
};

// Forgot Password API
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Fetch user details
    const user = await getUserByEmail(email);
    if (!user) {
      return response.NotFound(res, "User not found");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10); // Hashing OTP before storing
    const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 min expiry

    console.log(`Generated OTP for ${email}: ${otp} (hashed)`);

    // Connect to the database
    const pool = await connectToDatabase();

    // Remove any existing OTPs for this user
    await pool
      .request()
      .input("UserID", sql.NVarChar, user.Id)
      .input("OTPType", sql.NVarChar, "Password Reset")
      .query(
        "DELETE FROM UserOTPs WHERE UserId = @UserID AND OTPType = @OTPType"
      );

    // Insert new OTP into UserOTPs table
    await pool
      .request()
      .input("UserID", sql.NVarChar, user.Id)
      .input("OTPHash", sql.NVarChar, otpHash) // Storing the hashed OTP
      .input("OTPType", sql.NVarChar, "Password Reset")
      .input("Expiry", sql.DateTime, otpExpiry)
      .input("IsUsed", sql.Bit, 0) // 0 means unused OTP
      .input("CreatedAt", sql.DateTime, new Date()).query(`
                INSERT INTO UserOTPs (UserId, OTPHash, OTPType, Expiry, IsUsed, CreatedAt)
                VALUES (@UserID, @OTPHash, @OTPType, @Expiry, @IsUsed, @CreatedAt)
            `);

    // Send OTP email
    await sendMail(user.Email, "Your OTP Code for Password Reset", {
      userName: user.UserName,
      otp: otp,
      expirationTime: "5 minutes",
    });

    // Send OTP in the response
    return response.SuccessResponseWithData(res, "OTP generated successfully", {
      email,
      otp,
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return response.InternalServerError(res, "Something went wrong");
  }
};

// Verify OTP API
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return response.ValidationError(res, "Invalid credentials");
    }

    const pool = await connectToDatabase();

    // Fetch OTP entry for the user
    const result = await pool
      .request()
      .input("UserID", sql.NVarChar, user.Id)
      .input("OTPType", sql.NVarChar, "Password Reset").query(`
                SELECT OTPHash, Expiry, IsUsed FROM UserOTPs 
                WHERE UserId = @UserID AND OTPType = @OTPType
            `);

    if (!result.recordset.length) {
      return response.ValidationError(res, "Invalid or expired OTP");
    }

    const otpRecord = result.recordset[0];

    // Check if OTP is already used or expired
    if (otpRecord.IsUsed) {
      return response.ValidationError(res, "OTP has already been used");
    }

    if (new Date(otpRecord.Expiry) < new Date()) {
      return response.ValidationError(res, "OTP has expired");
    }

    // Compare the provided OTP with the stored hashed OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.OTPHash);
    if (!isMatch) {
      return response.ValidationError(res, "Invalid OTP");
    }

    // Generate an access token valid for 10 minutes
    const token = jwt.sign({ email, userId: user.Id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // Mark OTP as used
    await pool
      .request()
      .input("UserID", sql.NVarChar, user.Id)
      .input("OTPType", sql.NVarChar, "Password Reset")
      .query(
        "UPDATE UserOTPs SET IsUsed = 1 WHERE UserId = @UserID AND OTPType = @OTPType"
      );

    response.SuccessResponseWithData(res, "OTP verified successfully", {
      access_token: token,
    });
  } catch (err) {
    console.error("Error in verifyOTP:", err);
    response.InternalServerError(res, "Something went wrong");
  }
};

// Reset Password API
exports.resetPassword = async (req, res) => {
  const { access_token, email, new_password } = req.body;

  console.log("Reset Password Request Received:", {
    access_token,
    email,
    new_password,
  });

  try {
    if (!access_token || !email || !new_password) {
      console.log("Validation Error: Missing required fields");
      return response.ValidationError(
        res,
        "Access token, email, and new password are required"
      );
    }

    // Password security validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(new_password)) {
      console.log("Validation Error: Weak password");
      return response.ValidationError(
        res,
        "Password must be at least 8 characters long, contain at least one letter, one number, and one special character"
      );
    }

    // Verify the access token
    let decoded;
    try {
      decoded = jwt.verify(access_token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (err) {
      console.error("Token verification error:", err);
      return response.ValidationError(res, "Invalid or expired access token");
    }

    if (!decoded || decoded.email !== email) {
      console.log("Invalid credentials: Token email mismatch");
      return response.ValidationError(res, "Invalid credentials");
    }

    const user = await getUserByEmail(email);
    if (!user) {
      console.log("User not found for email:", email);
      return response.ValidationError(res, "Invalid credentials");
    }
    console.log("User found:", user.Id);

    const pool = await connectToDatabase();
    console.log("Connected to database");

    // Retrieve OTP record from the UserOTPs table for "Password Reset"
    const otpResult = await pool
      .request()
      .input("UserID", sql.NVarChar, user.Id)
      .input("OTPType", sql.NVarChar, "Password Reset")
      .query(
        "SELECT * FROM UserOTPs WHERE UserId = @UserID AND OTPType = @OTPType"
      );
    console.log("OTP Query Result:", otpResult.recordset);

    // Check if an OTP record exists
    if (!otpResult.recordset.length) {
      console.log("OTP verification required for user:", user.Id);
      return response.ValidationError(res, "OTP verification required");
    }

    const otpRecord = otpResult.recordset[0];

    // Check if the OTP is expired
    if (new Date(otpRecord.Expiry) < new Date()) {
      console.log("OTP expired for user:", user.Id);
      // Delete the expired OTP record
      await pool
        .request()
        .input("UserID", sql.NVarChar, user.Id)
        .input("OTPType", sql.NVarChar, "Password Reset")
        .query(
          "DELETE FROM UserOTPs WHERE UserID = @UserID AND OTPType = @OTPType"
        );
      return response.ValidationError(res, "OTP has expired");
    }

    // Check if the OTP has already been used
    if (otpRecord.IsUsed) {
      console.log("OTP already used for user:", user.Id);
      // Delete the used OTP record
      await pool
        .request()
        .input("UserID", sql.NVarChar, user.Id)
        .input("OTPType", sql.NVarChar, "Password Reset")
        .query(
          "DELETE FROM UserOTPs WHERE UserID = @UserID AND OTPType = @OTPType"
        );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    console.log("Password hashed successfully");

    // Update the user's password in the Users table
    await pool
      .request()
      .input("Id", sql.NVarChar, user.Id)
      .input("PasswordHash", sql.NVarChar(sql.MAX), hashedPassword)
      .query("UPDATE Users SET PasswordHash = @PasswordHash WHERE Id = @Id");
    console.log("Password updated successfully for user:", user.Id);

    // Clear the OTP record after a successful password reset
    await pool
      .request()
      .input("UserID", sql.NVarChar, user.Id)
      .input("OTPType", sql.NVarChar, "Password Reset")
      .query(
        "DELETE FROM UserOTPs WHERE UserID = @UserID AND OTPType = @OTPType"
      );
    console.log("OTP record cleared for user:", user.Id);

    response.SuccessResponseWithOutData(res, "Password reset successfully");
  } catch (err) {
    console.error("Error resetting password:", err);
    response.InternalServerError(res, "Something went wrong");
  }
};

// Refresh Token API
exports.refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  try {
    if (!refresh_token) {
      return response.ValidationError(res, "Refresh token is required");
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
      console.log("Decoded refresh token:", decoded);
    } catch (err) {
      console.error("Refresh token verification error:", err);
      return response.ValidationError(res, "Invalid or expired refresh token");
    }

    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.NVarChar, decoded.userId)
      .input("Token", sql.NVarChar, refresh_token)
      .query(
        "SELECT * FROM RefreshTokens WHERE UserId = @UserId AND Token = @Token"
      );

    if (result.recordset.length === 0) {
      return response.ValidationError(res, "Invalid refresh token");
    }

    const user = await getUserByEmail(decoded.email);
    if (!user) {
      return response.ValidationError(res, "Invalid credentials");
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { email: user.Email, userId: user.Id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    response.SuccessResponseWithData(res, "Token refreshed successfully", {
      access_token: newAccessToken,
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    response.InternalServerError(res, "Something went wrong");
  }
};

// Get User Tokens API
exports.getUserTokens = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query("SELECT * FROM UserTokens");
    response.SuccessResponseWithData(
      res,
      "User tokens retrieved successfully",
      result.recordset
    );
  } catch (err) {
    console.error("Error retrieving user tokens:", err);
    response.InternalServerError(res, err);
  }
};

// Get User by Email API
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Retrieve the user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return response.NotFound(res, "User not found");
    }

    response.SuccessResponseWithData(res, "User retrieved successfully", user);
  } catch (err) {
    response.InternalServerError(res, err);
  }
};

// Get All Users API
exports.getAllUsers = async (req, res) => {
  try {
    console.log("Get All Users API");
    // Connect to the database
    const pool = await connectToDatabase();

    // Retrieve all users
    const result = await pool.request().query("SELECT * FROM Users");

    response.SuccessResponseWithData(
      res,
      "Users retrieved successfully",
      result.recordset
    );
  } catch (err) {
    response.InternalServerError(res, err);
  }
};

// Update Profile API
exports.updateProfile = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token
  const {
    firstname,
    lastname,
    phonenumber,
    dateofbirth,
    state,
    city,
    zipcode,
  } = req.body.profile || {};

  try {
    // Validate date format if provided
    if (dateofbirth) {
      const dobRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dobRegex.test(dateofbirth)) {
        return response.ValidationError(
          res,
          "Date of birth must be in MM-DD-YYYY format"
        );
      }
    }

    // Connect to the database
    const pool = await connectToDatabase();

    // Build the update query dynamically based on provided fields
    const updateFields = [];
    if (firstname) updateFields.push(`FirstName = @FirstName`);
    if (lastname) updateFields.push(`LastName = @LastName`);
    if (phonenumber) updateFields.push(`PhoneNumber = @PhoneNumber`);
    if (dateofbirth) updateFields.push(`DateOfBirth = @DateOfBirth`);
    if (state) updateFields.push(`State = @State`);
    if (city) updateFields.push(`City = @City`);
    if (zipcode) updateFields.push(`ZipCode = @ZipCode`);

    if (updateFields.length === 0) {
      return response.ValidationError(res, "No fields provided to update");
    }

    const updateQuery = `
            UPDATE Users
            SET ${updateFields.join(", ")}
            WHERE Id = @UserId
        `;

    const request = pool.request().input("UserId", sql.NVarChar(450), userId);
    if (firstname) request.input("FirstName", sql.NVarChar(256), firstname);
    if (lastname) request.input("LastName", sql.NVarChar(256), lastname);
    if (phonenumber)
      request.input("PhoneNumber", sql.NVarChar(15), phonenumber);
    if (dateofbirth)
      request.input("DateOfBirth", sql.Date, new Date(dateofbirth));
    if (state) request.input("State", sql.NVarChar(50), state);
    if (city) request.input("City", sql.NVarChar(100), city);
    if (zipcode) request.input("ZipCode", sql.NVarChar(10), zipcode);

    await request.query(updateQuery);

    // Retrieve updated user details
    const result = await pool
      .request()
      .input("Id", sql.NVarChar(450), userId)
      .query(
        "SELECT Id, UserName, Email, FirstName, LastName, DateOfBirth, PhoneNumber, State, City, ZipCode FROM Users WHERE Id = @Id"
      );

    if (result.recordset.length === 0) {
      return response.NotFound(res, "User not found after update");
    }

    response.SuccessResponseWithData(
      res,
      "Profile updated successfully",
      result.recordset[0]
    );
  } catch (err) {
    console.error("Error updating profile:", err);
    response.InternalServerError(res, "Failed to update profile");
  }
};

// Get Home Data API
exports.getHomeData = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token

  try {
    // Connect to the database
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.NVarChar(455), userId)
      .execute("pwa_GetHome");

    if (result.recordset.length === 0) {
      return response.NotFound(res, "No home data found for the given user");
    }

    // Parse the JSON data from the result
    const homeData = result.recordset
      .map((record) => {
        try {
          return JSON.parse(
            record["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]
          );
        } catch (err) {
          console.error("Error parsing JSON from database:", err);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries if JSON parsing fails

    response.SuccessResponseWithData(
      res,
      "Home data retrieved successfully",
      homeData
    );
  } catch (err) {
    console.error("Error retrieving home data:", err);
    response.InternalServerError(res, "Failed to retrieve home data");
  }
};

// Get User API
exports.getUser = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token

  try {
    // Connect to the database
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("Id", sql.NVarChar(450), userId)
      .query(
        "SELECT Id, FullName, Email,UserName, DateOfBirth, PhoneNumber, State, City, ZipCode FROM Users WHERE Id = @Id"
      );

    if (result.recordset.length === 0) {
      return response.NotFound(res, "User not found");
    }

    response.SuccessResponseWithData(
      res,
      "User retrieved successfully",
      result.recordset[0]
    );
  } catch (err) {
    console.error("Error retrieving user:", err);
    response.InternalServerError(res, "Failed to retrieve user");
  }
};
