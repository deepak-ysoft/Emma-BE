const { connectToDatabase } = require("../config/config");
const sql = require("mssql");
const response = require("../common/response");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("GetUserProfileDetails");

    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "No profile data found for this user");
    }

    // The stored procedure returns a single column 'JsonResult' with the combined JSON
    let profile = null;
    try {
      const jsonKey = "JsonResult";
      if (result.recordset[0][jsonKey]) {
        profile = JSON.parse(result.recordset[0][jsonKey]);
        // Parse onboarding.Answers if present and string
        if (
          profile.onboarding &&
          profile.onboarding.Answers &&
          typeof profile.onboarding.Answers === "string"
        ) {
          try {
            profile.onboarding.Answers = JSON.parse(profile.onboarding.Answers);
          } catch (e) {
            // leave as string if parsing fails
          }
        }
      }
    } catch (err) {
      return response.InternalServerError(res, "Failed to parse profile data");
    }

    if (!profile) {
      return response.NotFound(res, "No profile data found for this user");
    }

    response.SuccessResponseWithData(
      res,
      "Profile data retrieved successfully",
      profile
    );
  } catch (err) {
    // Handle specific error codes from the stored procedure
    if (err.number === 70001) {
      return response.ValidationError(res, "User ID is required.");
    }
    if (err.number === 70002) {
      return response.NotFound(res, "User not found.");
    }
    console.error("Error retrieving profile data:", err);
    response.InternalServerError(res, "Failed to retrieve profile data");
  }
};

exports.updatePersonalInfo = async (req, res) => {
  const userId = req.user.userId;
  let { FullName, DateOfBirth, Gender, Ethnicity, Race } = req.body;

  // Normalize Gender, Ethnicity, and Race to lowercase
  if (Gender) Gender = Gender.toLowerCase();
  if (Ethnicity) Ethnicity = Ethnicity.toLowerCase();
  if (Race) Race = Race.toLowerCase();

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!userId || !FullName || !DateOfBirth || !Gender || !Ethnicity || !Race) {
    return response.ValidationError(
      res,
      "All personal information fields are required."
    );
  }
  if (!dateRegex.test(DateOfBirth)) {
    return response.ValidationError(
      res,
      "DateOfBirth must be in YYYY-MM-DD format."
    );
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("FullName", sql.NVarChar(512), FullName)
      .input("DateOfBirth", sql.Date, DateOfBirth)
      .input("Gender", sql.NVarChar(20), Gender)
      .input("Ethnicity", sql.NVarChar(50), Ethnicity)
      .input("Race", sql.NVarChar(50), Race)
      .execute("UpdatePersonalInfo");

    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "User not found or not updated.");
    }

    // Format the returned data if it is in the JSON_F52E2B61-18A1-11d1-B105-00805F49916B column
    let updatedUser = result.recordset[0];
    const jsonKey = "JSON_F52E2B61-18A1-11d1-B105-00805F49916B";
    if (updatedUser && updatedUser[jsonKey]) {
      try {
        updatedUser = JSON.parse(updatedUser[jsonKey]);
      } catch (e) {
        // leave as string if parsing fails
      }
    }

    response.SuccessResponseWithData(
      res,
      "Personal information updated successfully",
      updatedUser
    );
  } catch (err) {
    if (err.number === 50001) {
      return response.ValidationError(
        res,
        "All personal information fields are required."
      );
    }
    console.error("Error updating personal info:", err);
    response.InternalServerError(res, "Failed to update personal information");
  }
};

exports.updateUserContactLocation = async (req, res) => {
  const userId = req.user.userId;
  const { Email, PhoneNumber, StreetAddress, City, State, ZipCode, Country } =
    req.body;

  // Validate required fields
  if (
    !userId ||
    !Email ||
    !PhoneNumber ||
    !StreetAddress ||
    !City ||
    !State ||
    !ZipCode
  ) {
    return response.ValidationError(
      res,
      "All contact and location fields are required."
    );
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return response.ValidationError(res, "Invalid email format.");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("Email", sql.NVarChar(256), Email)
      .input("PhoneNumber", sql.NVarChar(15), PhoneNumber)
      .input("StreetAddress", sql.NVarChar(255), StreetAddress)
      .input("City", sql.NVarChar(100), City)
      .input("State", sql.NVarChar(100), State)
      .input("ZipCode", sql.NVarChar(20), ZipCode)
      .input("Country", sql.NVarChar(100), Country || "") // Country is optional
      .execute("UpdateUserContactLocation");

    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "User not found or not updated.");
    }

    // Format the returned data if it is in the JSON_F52E2B61-18A1-11d1-B105-00805F49916B column
    let updatedUser = result.recordset[0];
    const jsonKey = "JSON_F52E2B61-18A1-11d1-B105-00805F49916B";
    if (updatedUser && updatedUser[jsonKey]) {
      try {
        updatedUser = JSON.parse(updatedUser[jsonKey]);
      } catch (e) {
        // leave as string if parsing fails
      }
    }

    response.SuccessResponseWithData(
      res,
      "Contact and location information updated successfully",
      updatedUser
    );
  } catch (err) {
    if (err.number === 50002) {
      return response.ValidationError(
        res,
        "All contact and location fields are required."
      );
    }
    if (err.number === 50003) {
      return response.Conflict(
        res,
        "Email address is already in use by another account."
      );
    }
    console.error("Error updating contact/location info:", err);
    response.InternalServerError(
      res,
      "Failed to update contact and location information"
    );
  }
};

exports.updateHealthBackground = async (req, res) => {
  const userId = req.user.userId;
  const healthData = req.body;

  // Enum validation for medical history values
  const allowedEnum = ["Current", "Never", "Past"];

  // Helper to validate all values in an object are in allowedEnum
  function validateEnumValues(obj) {
    if (!obj || typeof obj !== "object") return true;
    return Object.values(obj).every(
      (v) => typeof v === "string" && allowedEnum.includes(v)
    );
  }

  // Validate allergies.allergyDetails is an array if present
  if (
    healthData.allergies &&
    healthData.allergies.allergyDetails &&
    !Array.isArray(healthData.allergies.allergyDetails)
  ) {
    return response.ValidationError(res, "allergyDetails must be an array");
  }

  // Validate medications.medicationDetails is an array if present
  if (
    healthData.medications &&
    healthData.medications.medicationDetails &&
    !Array.isArray(healthData.medications.medicationDetails)
  ) {
    return response.ValidationError(res, "medicationDetails must be an array");
  }

  // Validate personalMedicalHistory and gastrointestinalHistory enums
  if (
    (healthData.personalMedicalHistory &&
      !validateEnumValues(healthData.personalMedicalHistory)) ||
    (healthData.gastrointestinalHistory &&
      !validateEnumValues(healthData.gastrointestinalHistory))
  ) {
    return response.ValidationError(
      res,
      "All medical history values must be one of: Current, Never, Past"
    );
  }

  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("HealthData", sql.NVarChar(sql.MAX), JSON.stringify(healthData))
      .execute("UpdateUserHealthBackground");

    if (!result.recordset || result.recordset.length === 0) {
      return response.InternalServerError(
        res,
        "Failed to update health background"
      );
    }

    // Return the payload as sent from frontend (no transformation)
    response.SuccessResponseWithData(
      res,
      result.recordset[0].Message || "Health background updated successfully",
      healthData
    );
  } catch (err) {
    if (err.number === 50004) {
      return response.ValidationError(res, "User ID is required.");
    }
    console.error("Error updating health background:", err);
    response.InternalServerError(res, "Failed to update health background");
  }
};

exports.getHealthBackground = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("GetUserHealthBackground");

    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "User health background not found.");
    }

    const record = result.recordset[0];
    let healthData = null;
    if (record.HealthData) {
      try {
        healthData = JSON.parse(record.HealthData);

        // Parse allergies.allergyDetails if it's a string
        if (
          healthData.allergies &&
          typeof healthData.allergies.allergyDetails === "string"
        ) {
          try {
            healthData.allergies.allergyDetails = JSON.parse(
              healthData.allergies.allergyDetails
            );
          } catch {
            healthData.allergies.allergyDetails = [];
          }
        }

        // Parse medications.medicationDetails if it's a string
        if (
          healthData.medications &&
          typeof healthData.medications.medicationDetails === "string"
        ) {
          try {
            healthData.medications.medicationDetails = JSON.parse(
              healthData.medications.medicationDetails
            );
          } catch {
            healthData.medications.medicationDetails = [];
          }
        }
      } catch (e) {
        healthData = record.HealthData;
      }
    }

    response.SuccessResponseWithData(
      res,
      record.Message || "Health background fetched successfully",
      healthData
    );
  } catch (err) {
    if (err.number === 50005) {
      return response.ValidationError(res, "User ID is required.");
    }
    if (err.number === 50006) {
      return response.NotFound(res, "User health background not found.");
    }
    console.error("Error fetching health background:", err);
    response.InternalServerError(res, "Failed to fetch health background");
  }
};

exports.upsertUserMentalHealth = async (req, res) => {
  const userId = req.user.userId;
  const mentalHealthData = req.body;

  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }

  // Basic validation for depression and stressAnxiety keys
  if (
    !mentalHealthData ||
    typeof mentalHealthData !== "object" ||
    !mentalHealthData.depression ||
    !mentalHealthData.stressAnxiety
  ) {
    return response.ValidationError(
      res,
      "Payload must include depression and stressAnxiety objects."
    );
  }

  // Validate all required depression fields are present and are numbers
  const depressionFields = [
    "interest",
    "feelingDown",
    "sleep",
    "energy",
    "appetite",
    "selfWorth",
    "concentration",
    "movement",
    "thoughts",
  ];
  for (const field of depressionFields) {
    if (
      !Object.prototype.hasOwnProperty.call(
        mentalHealthData.depression,
        field
      ) ||
      typeof mentalHealthData.depression[field] !== "number"
    ) {
      return response.ValidationError(
        res,
        `depression.${field} is required and must be a number.`
      );
    }
  }

  // Validate all required stressAnxiety fields are present and are numbers
  const stressFields = [
    "nervous",
    "worryControl",
    "worryTooMuch",
    "relax",
    "restless",
    "irritable",
    "afraid",
  ];
  for (const field of stressFields) {
    if (
      !Object.prototype.hasOwnProperty.call(
        mentalHealthData.stressAnxiety,
        field
      ) ||
      typeof mentalHealthData.stressAnxiety[field] !== "number"
    ) {
      return response.ValidationError(
        res,
        `stressAnxiety.${field} is required and must be a number.`
      );
    }
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input(
        "MentalHealthData",
        sql.NVarChar(sql.MAX),
        JSON.stringify(mentalHealthData)
      )
      .execute("UpsertUserMentalHealth");

    if (!result.recordset || result.recordset.length === 0) {
      return response.InternalServerError(
        res,
        "Failed to update mental health record"
      );
    }

    const record = result.recordset[0];
    response.SuccessResponseWithData(
      res,
      record.Message || "Mental health record updated successfully",
      { recordId: record.RecordId }
    );
  } catch (err) {
    console.error("Error updating mental health record:", err);
    response.InternalServerError(res, "Failed to update mental health record");
  }
};

exports.getUserMentalHealth = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("GetUserMentalHealth");

    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "Mental health record not found.");
    }

    const record = result.recordset[0];
    let mentalHealthData = null;
    if (record.MentalHealthData) {
      try {
        mentalHealthData = JSON.parse(record.MentalHealthData);
      } catch {
        mentalHealthData = record.MentalHealthData;
      }
    }

    response.SuccessResponseWithData(
      res,
      record.Message || "Mental health record fetched successfully",
      mentalHealthData
    );
  } catch (err) {
    if (err.number === 50007) {
      return response.NotFound(res, "Mental health record not found.");
    }
    console.error("Error fetching mental health record:", err);
    response.InternalServerError(res, "Failed to fetch mental health record");
  }
};

exports.getHealthAssessmentByUserId = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("GetHealthAssessment");

    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "No health assessment record found.");
    }

    // If the proc returns an error status
    if (result.recordset[0].Status === "Error") {
      return response.NotFound(res, result.recordset[0].Message);
    }

    // Parse the HealthData JSON
    let healthData = null;
    if (result.recordset[0].HealthData) {
      try {
        healthData = JSON.parse(result.recordset[0].HealthData);

        // Ensure familyHistory is properly parsed if it exists
        if (
          healthData.familyHistory &&
          typeof healthData.familyHistory === "string"
        ) {
          try {
            healthData.familyHistory = JSON.parse(healthData.familyHistory);
          } catch (e) {
            // If parsing fails, keep as string or set to null
            healthData.familyHistory = null;
          }
        }
      } catch (e) {
        console.error("Error parsing health data:", e);
        healthData = result.recordset[0].HealthData;
      }
    }

    response.SuccessResponseWithData(
      res,
      result.recordset[0].Message || "Health assessment fetched successfully",
      healthData
    );
  } catch (err) {
    if (err.number === 50002) {
      return response.NotFound(res, "Health assessment not found");
    }
    console.error("Error fetching health assessment:", err);
    response.InternalServerError(res, "Failed to fetch health assessment");
  }
};

exports.insertHealthAssessment = async (req, res) => {
  const userId = req.user.userId;
  const payload = req.body;

  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }
  if (!payload || typeof payload !== "object") {
    return response.ValidationError(
      res,
      "Payload is required and must be an object."
    );
  }

  // Map payload to stored procedure parameters
  const p = payload;
  const fh = p.familyHistory || {};
  // Remove parentsAlive and parentsDeathCause from familyHistoryData
  const familyHistoryData = { ...fh };
  delete familyHistoryData.parentsAlive;
  delete familyHistoryData.parentsDeathCause;

  try {
    const pool = await connectToDatabase();
    const request = pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input(
        "GeneralHealth",
        sql.NVarChar(100),
        p.generalHealth?.health || null
      )
      .input("PainLevel", sql.NVarChar(100), p.pain?.level || null)
      .input("Calm", sql.NVarChar(100), p.mentalHealth?.calm || null)
      .input("Energy", sql.NVarChar(100), p.mentalHealth?.energy || null)
      .input(
        "Downhearted",
        sql.NVarChar(100),
        p.mentalHealth?.downhearted || null
      )
      .input(
        "Interference",
        sql.NVarChar(100),
        p.socialFunctioning?.interference || null
      )
      .input(
        "AccomplishLessRolePhysical",
        sql.Bit,
        p.rolePhysical?.accomplishLess ?? null
      )
      .input("LimitedRolePhysical", sql.Bit, p.rolePhysical?.limited ?? null)
      .input(
        "AccomplishLessRoleEmotional",
        sql.Bit,
        p.roleEmotional?.accomplishLess ?? null
      )
      .input("LimitedRoleEmotional", sql.Bit, p.roleEmotional?.limited ?? null)
      .input("IdealLife", sql.NVarChar(100), p.swls?.idealLife || null)
      .input("Conditions", sql.NVarChar(100), p.swls?.conditions || null)
      .input("Satisfied", sql.NVarChar(100), p.swls?.satisfied || null)
      .input(
        "ImportantThings",
        sql.NVarChar(100),
        p.swls?.importantThings || null
      )
      .input("ChangeNothing", sql.NVarChar(100), p.swls?.changeNothing || null)
      .input("ParentsAlive", sql.Bit, fh.parentsAlive ?? null)
      .input(
        "ParentsDeathCause",
        sql.NVarChar(255),
        fh.parentsDeathCause || null
      )
      .input(
        "ModerateActivities",
        sql.NVarChar(100),
        p.physicalHealth?.moderateActivities || null
      )
      .input(
        "ClimbingStairs",
        sql.NVarChar(100),
        p.physicalHealth?.climbingStairs || null
      )
      .input(
        "FamilyHistoryData",
        sql.NVarChar(sql.MAX),
        Object.keys(familyHistoryData).length > 0
          ? JSON.stringify(familyHistoryData)
          : null
      );

    await request.execute("UpsertHealthAssessment");

    response.SuccessResponseWithOutData(
      res,
      "Health assessment inserted successfully"
    );
  } catch (err) {
    console.error("Error inserting health assessment:", err);
    response.InternalServerError(res, "Failed to insert health assessment");
  }
};

exports.upsertWellnessData = async (req, res) => {
  const userId = req.user.userId;
  const wellnessData = req.body;

  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }
  if (!wellnessData || typeof wellnessData !== "object") {
    return response.ValidationError(
      res,
      "Payload is required and must be an object."
    );
  }

  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input(
        "WellnessDataJson",
        sql.NVarChar(sql.MAX),
        JSON.stringify(wellnessData)
      )
      .execute("UpsertWellnessData");

    response.SuccessResponseWithOutData(
      res,
      "Wellness data upserted successfully"
    );
  } catch (err) {
    console.error("Error upserting wellness data:", err);
    response.InternalServerError(res, "Failed to upsert wellness data");
  }
};

exports.getWellnessData = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("GetWellnessData");

    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "Wellness data not found.");
    }

    // Get the first row's first column (the JSON string)
    const jsonResult = result.recordset[0][Object.keys(result.recordset[0])[0]];

    if (!jsonResult) {
      return response.NotFound(res, "Wellness data not found.");
    }

    // Parse the complete JSON response
    const wellnessData = JSON.parse(jsonResult);

    response.SuccessResponseWithData(
      res,
      "Wellness data fetched successfully",
      wellnessData
    );
  } catch (err) {
    console.error("Error fetching wellness data:", err);
    response.InternalServerError(res, "Failed to fetch wellness data");
  }
};

exports.getUserProgressStatus = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({
      statusCode: 400,
      message: "User ID is required.",
      data: null,
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("GetUserProgressStatus");

    if (!result.recordset || result.recordset.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Progress status not found.",
        data: null,
      });
    }

    const record = result.recordset[0];

    // Parse completedSections if it's a string
    let completedSections = [];
    if (record.completedSections) {
      if (typeof record.completedSections === "string") {
        try {
          completedSections = JSON.parse(record.completedSections);
        } catch {
          completedSections = [];
        }
      } else {
        completedSections = record.completedSections;
      }
    }

    const data = {
      progressPercentage: record.progressPercentage,
      completedSections,
      currentSection: record.currentSection,
    };

    res.status(200).json({
      statusCode: 200,
      message: "Progress status fetched successfully",
      data,
    });
  } catch (err) {
    console.error("Error fetching user progress status:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Failed to fetch progress status",
      data: null,
    });
  }
};

exports.changeUserPassword = async (req, res) => {
  const userId = req.user.userId;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  // Validate all fields are provided
  if (!userId || !currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({
      success: false,
      message: "All password fields are required.",
    });
  }

  // Validate new password matches confirmation
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirmation do not match.",
    });
  }

  // Validate new password strength (optional)
  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long.",
    });
  }

  try {
    const pool = await connectToDatabase();

    // 1. First get the user's current password hash
    const userResult = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .query("SELECT PasswordHash FROM Users WHERE Id = @UserId");

    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const currentHash = userResult.recordset[0].PasswordHash;

    // 2. Verify current password with bcrypt
    const isPasswordValid = await bcrypt.compare(currentPassword, currentHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // 3. Hash the new password with bcrypt
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Update password in database
    const updateResult = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("NewPasswordHash", sql.NVarChar(sql.MAX), hashedNewPassword)
      .query(`
        UPDATE Users 
        SET 
          PasswordHash = @NewPasswordHash,
          SecurityStamp = NEWID(),
          UpdatedAt = GETUTCDATE()
        WHERE Id = @UserId
      `);

    // 5. Verify update was successful
    if (updateResult.rowsAffected[0] === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to update password.",
      });
    }

    // 6. Return success response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
      data: {
        userId: userId,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while changing password.",
    });
  }
};

exports.deleteUserAccountWithCascade = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
    });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("DeleteUserAccountWithCascade");

    const row = result.recordset && result.recordset[0];
    if (!row) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete user account." });
    }

    const status = parseInt(row.status, 10);
    const isSuccess = row.success === "true";

    if (!isSuccess) {
      return res.status(status).json({ success: false, message: row.message });
    }

    let data = null;
    if (row.data) {
      try {
        data = JSON.parse(row.data);
      } catch {
        data = row.data;
      }
    }

    return res.status(200).json({
      success: true,
      message: row.message,
      data,
    });
  } catch (err) {
    console.error("Error deleting user account:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete user account." });
  }
};

exports.getUserProfileBasic = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
    });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("GetUserProfile");

    const row = result.recordset && result.recordset[0];
    if (!row) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to retrieve user profile." });
    }

    const status = parseInt(row.status, 10);
    const isSuccess = row.success === "true";

    if (!isSuccess) {
      return res.status(status).json({ success: false, message: row.message });
    }

    let data = null;
    if (row.data) {
      try {
        data = JSON.parse(row.data);
      } catch {
        data = row.data;
      }
    }

    return res.status(200).json({
      success: true,
      message: row.message,
      data,
    });
  } catch (err) {
    console.error("Error retrieving user profile:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve user profile." });
  }
};

exports.updateUserAccount = async (req, res) => {
  const userId = req.user.userId;
  const { FullName, Email, PhoneNumber } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("FullName", sql.NVarChar(512), FullName || null)
      .input("Email", sql.NVarChar(256), Email || null)
      .input("PhoneNumber", sql.NVarChar(15), PhoneNumber || null)
      .execute("UpdateUserAccount");

    const row = result.recordset && result.recordset[0];
    if (!row) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update user profile." });
    }

    const status = parseInt(row.status, 10);
    const isSuccess = row.success === "true";

    if (!isSuccess) {
      return res.status(status).json({ success: false, message: row.message });
    }

    let data = null;
    if (row.data) {
      try {
        data = JSON.parse(row.data);
      } catch {
        data = row.data;
      }
    }

    return res.status(200).json({
      success: true,
      message: row.message,
      data,
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update user profile." });
  }
};

exports.createContactUsSubmission = async (req, res) => {
  const userId = req.user ? req.user.userId : null;
  const { Name, Email, Subject, Message } = req.body;

  if (!Name || !Email || !Subject || !Message) {
    return res.status(400).json({
      success: false,
      message: "Name, Email, Subject, and Message are required.",
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("Name", sql.NVarChar(100), Name)
      .input("Email", sql.NVarChar(256), Email)
      .input("Subject", sql.NVarChar(200), Subject)
      .input("Message", sql.NVarChar(sql.MAX), Message)
      .execute("CreateContactUsSubmission");

    const row = result.recordset && result.recordset[0];
    if (!row) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to submit contact form." });
    }

    const status = parseInt(row.status, 10);
    const isSuccess = row.success === "true";

    if (!isSuccess) {
      return res.status(status).json({ success: false, message: row.message });
    }

    let data = null;
    if (row.data) {
      try {
        data = JSON.parse(row.data);
      } catch {
        data = row.data;
      }
    }

    // Send notification email to info@myemmahealth.com
    try {
      const sendMail = require("../utils/sendMail"); // Adjust path as needed
      await sendMail({
        to: "info@myemmahealth.com",
        subject: `New Contact Us Submission: ${Subject}`,
        text: `Name: ${Name}\nEmail: ${Email}\nSubject: ${Subject}\nMessage:\n${Message}`,
      });
    } catch (mailErr) {
      // Log but do not fail the API if email fails
      console.error("Failed to send contact us notification email:", mailErr);
    }

    return res.status(200).json({
      success: true,
      message: row.message,
      data,
    });
  } catch (err) {
    console.error("Error submitting contact form:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to submit contact form." });
  }
};

exports.getUserProfileDetails = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("sp_GetUserProfileDetails");
    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "User profile details not found.");
    }
    return response.SuccessResponseWithData(
      res,
      "User profile details fetched successfully",
      result.recordset[0]
    );
  } catch (err) {
    console.error("Error fetching user profile details:", err);
    return response.InternalServerError(res, err);
  }
};

exports.upsertUserProfileDetails = async (req, res) => {
  const userId = req.user.userId;
  const { HealthFocus, MotivationLevel } = req.body;
  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }
  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("HealthFocus", sql.NVarChar(50), HealthFocus || null)
      .input("MotivationLevel", sql.Int, MotivationLevel || null)
      .execute("sp_UpsertUserProfileDetails");
    return response.SuccessResponseWithOutData(
      res,
      "User profile details upserted successfully"
    );
  } catch (err) {
    console.error("Error upserting user profile details:", err);
    return response.InternalServerError(res, err);
  }
};

exports.editUserProfileDetails = async (req, res) => {
  const userId = req.user.userId;
  const { HealthFocus, MotivationLevel } = req.body;
  if (!userId) {
    return response.ValidationError(res, "User ID is required.");
  }
  if (HealthFocus == null && MotivationLevel == null) {
    return response.ValidationError(
      res,
      "At least one field (HealthFocus or MotivationLevel) must be provided."
    );
  }
  if (MotivationLevel != null && (MotivationLevel < 1 || MotivationLevel > 5)) {
    return response.ValidationError(
      res,
      "MotivationLevel must be between 1 and 5."
    );
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("HealthFocus", sql.NVarChar(50), HealthFocus || null)
      .input("MotivationLevel", sql.Int, MotivationLevel || null)
      .execute("sp_EditUserProfileDetails");
    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, "User profile details not found.");
    }
    return response.SuccessResponseWithData(
      res,
      "User profile details updated successfully",
      result.recordset[0]
    );
  } catch (err) {
    // SQL RAISERROR returns error.message
    return response.InternalServerError(res, err);
  }
};

// Get user action plan narratives by user ID
exports.getUserActionPlanNarratives = async (req, res) => {
  const userId = req.user && req.user.userId;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserID", sql.UniqueIdentifier, userId)
      .execute("GetUserActionPlanNarrativesByUserID");

    const narratives = result.recordset || [];
    return res.status(200).json({
      success: true,
      message: "User action plan narratives fetched successfully.",
      data: narratives,
    });
  } catch (err) {
    console.error("Error fetching user action plan narratives:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user action plan narratives.",
      error: err.message,
    });
  }
};

/**
 * Get a user action plan narrative and its sections by NarrativeID
 */
exports.getUserActionPlanNarrativeByNarrativeID = async (req, res) => {
  const narrativeId = parseInt(req.params.narrativeId, 10);
  if (!narrativeId || isNaN(narrativeId)) {
    return res.status(400).json({
      success: false,
      message: "NarrativeID is required.",
    });
  }

  try {
    // Use connectToDatabase and sql instead of db.query
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("NarrativeID", sql.Int, narrativeId)
      .execute("GetUserActionPlanNarrativeByNarrativeID");

    if (!result || !result.recordset || result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User action plan narrative not found.",
      });
    }

    // Group narrative and sections
    const rows = result.recordset;
    const narrative = {
      NarrativeID: rows[0].NarrativeID,
      UserID: rows[0].UserID,
      OrderNo: rows[0].OrderNo,
      SummaryText: rows[0].SummaryText,
      DisplayStartDate: rows[0].DisplayStartDate,
      CreatedAt: rows[0].CreatedAt,
      UpdatedAt: rows[0].UpdatedAt,
      Sections: [],
    };

    rows.forEach((row) => {
      if (row.SectionID) {
        narrative.Sections.push({
          SectionID: row.SectionID,
          SectionOrder: row.SectionOrder,
          SectionHeading: row.SectionHeading,
          SectionBody: row.SectionBody,
          SectionCreatedAt: row.SectionCreatedAt,
          SectionUpdatedAt: row.SectionUpdatedAt,
        });
      }
    });

    res.json({
      success: true,
      message: "User action plan narrative fetched successfully.",
      data: narrative,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user action plan narrative.",
      error: error.message,
    });
  }
};

exports.getUserEatingPreferences = async (req, res) => {
  const userId = req.user.userId;

  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    request.input("EmmaUserId", sql.NVarChar(50), userId);

    const result = await request.execute("pwa_GetUserPreferences");

    return response.SuccessResponseWithData(
      res,
      "Data retrieved successfully",
      result.recordset
    );
  } catch (error) {
    return response.FailedResponseWithOutData(
      res,
      error.response?.data || error.message
    );
  }
};

exports.addUserEatingPreferences = async (req, res) => {
  const userId = req.user.userId;
  const { PreferenceType, Ingredient } = req.body;

  if (!PreferenceType || !Ingredient) {
    return res.status(400).json({
      message: "Missing required fields: PreferenceType or Ingredient.",
    });
  }

  try {
    const pool = await connectToDatabase();
    const request = pool.request();

    request.input("EmmaUserId", sql.NVarChar(50), userId);
    request.input("PreferenceType", sql.NVarChar(20), PreferenceType);
    request.input("Ingredient", sql.NVarChar(100), Ingredient);

    await request.execute("pwa_AddUserPreference");

    return response.SuccessResponseWithData(
      res,
      "Preference added successfully."
    );
  } catch (error) {
    return response.FailedResponseWithOutData(
      res,
      error.response?.data || error.message
    );
  }
};

exports.removeEatingPreferences = async (req, res) => {
  const { IngredientId } = req.body;

  if (!IngredientId) {
    return res.status(400).json({
      message: "Missing required field: IngredientId.",
    });
  }

  try {
    const pool = await connectToDatabase();
    const request = pool.request();

    request.input("IngredientId", sql.Int, IngredientId);
    await request.execute("pwa_DeleteUserPreference");

    res.status(200).json({
      message: "Preference deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete preference.",
      error: err.message,
    });
  }
};
