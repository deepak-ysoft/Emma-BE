const { connectToDatabase } = require("../config/config");
const sql = require("mssql");
const response = require("../common/response");
const { getUserById } = require("../helpers/userHelper"); // Add this line
const { uploadFile } = require("../middleware/blobStorage");
const { v4: uuidv4 } = require("uuid"); // Add this at the top if not present

// Retrieves the list of action plans for the user
exports.getActionPlansByUserId = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token

  // Check if user exists
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, "User not found");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.NVarChar, userId)
      .execute("pwa_GetActionPlanDetailsByUserId");

    if (result.recordset.length === 0) {
      return response.NotFound(res, "No action plans found for the given user");
    }

    response.SuccessResponseWithData(
      res,
      "Action plans retrieved successfully",
      result.recordset
    );
  } catch (err) {
    console.error("Error retrieving action plans by user ID:", err);
    response.InternalServerError(res, "Failed to retrieve action plans");
  }
};

// Fetches lab order action plan details
exports.getActionPlanDetailsByLabOrderId = async (req, res) => {
  const { orderNo } = req.params;
  const { startDate, endDate } = req.query;

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return response.ValidationError(
      res,
      "Start date and end date must be in YYYY-MM-DD format"
    );
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("OrderNo", sql.NVarChar(100), orderNo)
      .input("StartDate", sql.DateTime2, new Date(startDate))
      .input("EndDate", sql.DateTime2, new Date(endDate))
      .execute("pwa_GetActionPlanDetailsbyLabOrderId");

    if (result.recordset.length === 0) {
      return response.NotFound(
        res,
        "No action plan details found for the given lab order"
      );
    }

    response.SuccessResponseWithData(
      res,
      "Action plan details retrieved successfully",
      result.recordset
    );
  } catch (err) {
    console.error("Error retrieving action plan details by lab order ID:", err);
    response.InternalServerError(res, "Failed to retrieve action plan details");
  }
};

// Fetches action plan data by kit order
exports.getActionPlanByKit = async (req, res) => {
  const { orderNo } = req.params;
  const { startDate, endDate } = req.query;

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return response.ValidationError(
      res,
      "Start date and end date must be in YYYY-MM-DD format"
    );
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("OrderNo", sql.NVarChar(100), orderNo)
      .input("StartDate", sql.DateTime2, new Date(startDate))
      .input("EndDate", sql.DateTime2, new Date(endDate))
      .execute("pwa_GetActionPlanByKit");

    if (result.recordset.length === 0) {
      return response.NotFound(
        res,
        "No action plan data found for the given kit order"
      );
    }

    // Extract and parse the JSON string
    const parsedData = result.recordset
      .map((entry) => {
        if (entry["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]) {
          try {
            return JSON.parse(
              entry["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]
            );
          } catch (error) {
            console.error(
              `Error parsing JSON for entry ${entry.KitId}:`,
              error
            );
            return null; // Handle invalid JSON gracefully
          }
        }
        return entry; // Return entry as is if no JSON string exists
      })
      .filter(Boolean); // Remove null entries if JSON parsing fails

    response.SuccessResponseWithData(
      res,
      "Action plan data retrieved successfully",
      parsedData
    );
  } catch (err) {
    console.error("Error retrieving action plan data by kit order:", err);
    response.InternalServerError(res, "Failed to retrieve action plan data");
  }
};

exports.logEnergyProgress = async (req, res) => {
  const UserId = req.user.userId;
  const { EnergyLevel, LogDate, LogTime, Notes } = req.body;
  const file = req.file;

  console.log("Received request to log energy progress:", {
    UserId,
    EnergyLevel,
    LogDate,
    LogTime,
    Notes,
  });

  // Validate LogTime format
  const timeRegex = /^([0-1]?\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(LogTime)) {
    return response.ValidationError(res, "LogTime must be in hh:mm format");
  }

  try {
    let blobUrl = null;
    if (file) {
      console.log("File received for upload:", file.originalname);
      blobUrl = await uploadFile(file.originalname, file.buffer, file.mimetype);
      console.log("File uploaded successfully, blob URL:", blobUrl);
    }

    // Connect to the database
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.NVarChar(450), UserId)
      .input("EnergyLevel", sql.Int, EnergyLevel)
      .input("LogDate", sql.DateTime2, new Date(LogDate))
      .input("LogTime", sql.NVarChar, LogTime)
      .input("Notes", sql.NVarChar(sql.MAX), Notes)
      .input("blobIds", sql.NVarChar(sql.MAX), blobUrl)
      .execute("pwa_LogEnergyProgress");

    // Extract and parse the JSON data from the result
    let formattedData = [];
    if (result.recordset && result.recordset.length > 0) {
      formattedData = result.recordset.map((item) => {
        try {
          if (item["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]) {
            return JSON.parse(
              item["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]
            );
          }
          return item;
        } catch (e) {
          console.error("Error parsing JSON from database:", e);
          return item;
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Energy progress logged successfully",
      data: formattedData.length > 0 ? formattedData : "No data returned",
    });
  } catch (error) {
    console.error("Error logging energy progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log energy progress",
      error: error.message,
    });
  }
};

// Stores survey answers
exports.postSurveyAnswers = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token
  const { json } = req.body;

  try {
    const pool = await connectToDatabase();
    await pool
      .request()
      .input("UserId", sql.NVarChar(450), userId)
      .input("json", sql.NVarChar(sql.MAX), JSON.stringify(json))
      .execute("pwa_PostSurveyAnswers");

    response.SuccessResponseWithOutData(
      res,
      "Survey answers stored successfully"
    );
  } catch (err) {
    console.error("Error storing survey answers:", err);
    response.InternalServerError(res, "Failed to store survey answers");
  }
};

// Retrieves learning library content
exports.getLearningLibraryContent = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserID", sql.NVarChar(450), userId) // Pass the UserID parameter
      .execute("pwa_GetLearningLibraryContent");

    if (result.recordset.length === 0) {
      return response.NotFound(res, "No learning library content found");
    }

    // Parse the JSON string in the result
    const formattedData = result.recordset
      .map((record) => {
        const jsonKey = "JSON_F52E2B61-18A1-11d1-B105-00805F49916B";
        if (record[jsonKey]) {
          try {
            return JSON.parse(record[jsonKey]);
          } catch (err) {
            console.error("Error parsing JSON:", err);
            return null; // Handle invalid JSON gracefully
          }
        }
        return null; // Handle missing JSON key gracefully
      })
      .flat()
      .filter(Boolean); // Flatten and remove null entries

    response.SuccessResponseWithData(
      res,
      "Learning library content retrieved successfully",
      formattedData
    );
  } catch (err) {
    console.error("Error retrieving learning library content:", err);
    response.InternalServerError(
      res,
      "Failed to retrieve learning library content"
    );
  }
};

// Saves onboarding data
exports.saveOnboardingData = async (req, res) => {
  const userId = req.user.userId;
  const { answers } = req.body;
  console.log("Received request to save onboarding data:", { userId, answers });
  // Validate userId and answers
  if (!userId || !answers) {
    return response.ValidationError(
      res,
      "Invalid or missing user_id or answers"
    );
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("userId", sql.UniqueIdentifier, userId)
      .input("answers", sql.NVarChar(sql.MAX), JSON.stringify(answers))
      .execute("pwa_SaveOnboardingData");

    if (result.recordset && result.recordset.length > 0) {
      response.SuccessResponseWithData(
        res,
        "Onboarding data saved successfully",
        result.recordset[0]
      );
    } else {
      response.InternalServerError(
        res,
        "Failed to retrieve inserted onboarding data"
      );
    }
  } catch (err) {
    if (err.number === 50002) {
      return response.NotFound(res, "User does not exist");
    } else if (err.number === 50003) {
      return response.Conflict(
        res,
        "User already has an existing onboarding record"
      );
    }
    console.error("Error saving onboarding data:", err);
    response.InternalServerError(res, "Failed to save onboarding data");
  }
};

// Retrieves onboarding data for the user
exports.getOnboardingData = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("userId", sql.UniqueIdentifier, userId)
      .execute("pwa_GetOnboardingData");

    if (result.recordset.length === 0) {
      return response.NotFound(res, "No onboarding data found for this user");
    }

    // Parse the Answers JSON if it exists
    const onboardingData = result.recordset[0];
    if (onboardingData.Answers) {
      try {
        onboardingData.Answers = JSON.parse(onboardingData.Answers);
      } catch (err) {
        console.error("Error parsing Answers JSON:", err);
      }
    }

    response.SuccessResponseWithData(
      res,
      "Onboarding data retrieved successfully",
      onboardingData
    );
  } catch (err) {
    console.error("Error retrieving onboarding data:", err);

    // Handle specific error codes from the stored procedure
    if (err.number === 50010) {
      return response.ValidationError(res, "Missing userId");
    } else if (err.number === 50011) {
      return response.NotFound(res, "User does not exist");
    } else if (err.number === 50012) {
      return response.NotFound(res, "No onboarding data found for this user");
    }

    response.InternalServerError(res, "Failed to retrieve onboarding data");
  }
};

exports.saveDailyCheckIn = async (req, res) => {
  const UserId = req.user.userId;
  let { CheckInType, Questions } = req.body;

  // Normalize CheckInType to lowercase for consistency
  if (CheckInType) {
    CheckInType = CheckInType.toLowerCase();
  }

  // Generate current date in YYYY-MM-DD format
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const DateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;

  if (!UserId || !CheckInType || !Questions) {
    return response.ValidationError(
      res,
      "Missing one or more required parameters."
    );
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, UserId)
      .input("Date", sql.Date, DateStr)
      .input("CheckInType", sql.VarChar(100), CheckInType)
      .input("Questions", sql.NVarChar(sql.MAX), JSON.stringify(Questions))
      .execute("pwa_SaveDailyCheckIn");

    if (result.recordset && result.recordset.length > 0) {
      // Format the response date to YYYY-MM-DD (if necessary)
      const record = result.recordset[0];
      if (record.Date) {
        record.Date = new Date(record.Date).toISOString().split("T")[0];
      }
      response.SuccessResponseWithData(
        res,
        "Daily check-in saved successfully",
        record
      );
    } else {
      response.InternalServerError(res, "Failed to save daily check-in");
    }
  } catch (err) {
    if (err.number === 60001) {
      return response.ValidationError(
        res,
        "Missing one or more required parameters."
      );
    }
    if (err.number === 60002) {
      return response.NotFound(res, "User does not exist.");
    }
    if (err.number === 60003) {
      return response.FailedResponseWithOutData(
        res,
        "Daily check-in already exists for this date and type."
      );
    }
    console.error("Error saving daily check-in:", err);
    response.InternalServerError(res, "Failed to save daily check-in");
  }
};

// Edit (overwrite) a daily check-in for a user, date, and type
exports.editDailyCheckIn = async (req, res) => {
  const UserId = req.user.userId;
  let { CheckInType, Questions } = req.body;

  // Normalize CheckInType to lowercase for consistency
  if (CheckInType) {
    CheckInType = CheckInType.toLowerCase();
  }

  // Generate current date in YYYY-MM-DD format
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const DateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  // console.log('DateStr:', DateStr);

  if (!UserId || !CheckInType || !Questions) {
    return response.ValidationError(
      res,
      "Missing one or more required parameters."
    );
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, UserId)
      .input("Date", sql.Date, DateStr)
      .input("CheckInType", sql.VarChar(100), CheckInType)
      .input("Questions", sql.NVarChar(sql.MAX), JSON.stringify(Questions))
      .execute("pwa_EditDailyCheckIn");

    if (result.recordset && result.recordset.length > 0) {
      response.SuccessResponseWithData(
        res,
        "Daily check-in edited successfully",
        result.recordset[0]
      );
    } else {
      response.InternalServerError(res, "Failed to edit daily check-in");
    }
  } catch (err) {
    if (err.number === 60001) {
      return response.ValidationError(
        res,
        "Missing one or more required parameters."
      );
    }
    if (err.number === 60002) {
      return response.NotFound(res, "User does not exist.");
    }
    console.error("Error editing daily check-in:", err);
    response.InternalServerError(res, "Failed to edit daily check-in");
  }
};

exports.getDailyCheckIn = async (req, res) => {
  const userId = req.user.userId;
  const { date } = req.query;

  if (!userId || !date) {
    return response.ValidationError(
      res,
      "Missing required parameters: userId or date."
    );
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("Date", sql.Date, date)
      .execute("pwa_GetDailyCheckIn");

    // result.recordset: all check-ins for the given user and date
    let checkInInfo = result.recordset || [];

    if (checkInInfo.length === 0) {
      return response.NotFound(
        res,
        "No check-in found for the given user and date."
      );
    }

    // Parse the 'data' property if it's a JSON string
    checkInInfo = checkInInfo.map((item) => {
      if (typeof item.data === "string") {
        try {
          return { ...item, data: JSON.parse(item.data) };
        } catch (e) {
          // If parsing fails, leave as string
          return item;
        }
      }
      return item;
    });

    response.SuccessResponseWithData(
      res,
      "Daily check-in retrieved successfully",
      checkInInfo
    );
  } catch (err) {
    if (err.number === 70001) {
      return response.ValidationError(
        res,
        "Missing required parameters: UserId or Date."
      );
    }
    if (err.number === 70002) {
      return response.NotFound(
        res,
        "No check-in found for the given user and date."
      );
    }
    console.error("Error retrieving daily check-in:", err);
    response.InternalServerError(res, "Failed to retrieve daily check-in");
  }
};

// Get all recipes for a user for a given week, grouped by day
exports.getUserWeekRecipesGroupedByDay = async (req, res) => {
  const userId = req.user.userId;
  const week = parseInt(req.query.week, 10);

  if (!week || isNaN(week)) {
    return response.ValidationError(res, "Missing or invalid week parameter");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("Week", sql.Int, week)
      .execute("GetUserWeekRecipesGroupedByDay");

    if (!result.recordset.length) {
      return response.NotFound(res, "No recipes found for the given week");
    }

    // The stored procedure returns a single row with a JSON string in the first column
    let data;
    try {
      const key = Object.keys(result.recordset[0])[0];
      data = JSON.parse(result.recordset[0][key]);

      // Fix Tags property for each day/meal
      if (data && Array.isArray(data.Days)) {
        data.Days = data.Days.map((day) => {
          if (typeof day.Tags === "string") {
            // Try to parse as array of objects if possible
            try {
              // Wrap in [] if not already
              let tagsStr = day.Tags.trim();
              if (!tagsStr.startsWith("[")) {
                tagsStr = `[${tagsStr}]`;
              }
              day.Tags = JSON.parse(tagsStr);
            } catch (e) {
              // fallback: split by "},{" and wrap with []
              try {
                let fixed = `[${day.Tags}]`.replace(/}\s*,\s*{/g, "},{");
                day.Tags = JSON.parse(fixed);
              } catch {
                day.Tags = [];
              }
            }
          }
          return day;
        });
      }
    } catch (err) {
      return response.InternalServerError(res, "Failed to parse recipes data");
    }

    response.SuccessResponseWithData(
      res,
      "Recipes retrieved successfully",
      data
    );
  } catch (err) {
    console.error("Error retrieving recipes:", err);
    response.InternalServerError(res, "Failed to retrieve recipes");
  }
};

// Get user's shopping list for a specific diet plan template
exports.getUserShoppingListByDietPlan = async (req, res) => {
  const userId = req.user.userId;
  const dietPlanTemplateId =
    req.query.dietPlanTemplateId || "50F4AAFD-AF61-4164-8751-8972B98F6256";

  // Basic UUID validation
  if (!/^[0-9A-Fa-f-]{36}$/.test(dietPlanTemplateId)) {
    return response.ValidationError(res, "Invalid DietPlanTemplateId");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("DietPlanTemplateId", sql.UniqueIdentifier, dietPlanTemplateId)
      .execute("GetUserShoppingListByDietPlan");

    if (!result.recordset.length) {
      return response.NotFound(res, "No shopping list found");
    }

    // Defensive: handle both JSON and direct array result
    let data;
    try {
      const key = Object.keys(result.recordset[0])[0];
      const value = result.recordset[0][key];
      // Only parse if non-empty string, else return empty array
      if (typeof value === "string" && value.trim().length > 0) {
        data = JSON.parse(value);
      } else {
        data = [];
      }
    } catch (err) {
      console.error(
        "Failed to parse shopping list data:",
        err,
        result.recordset
      );
      return response.InternalServerError(
        res,
        "Failed to parse shopping list data"
      );
    }

    response.SuccessResponseWithData(
      res,
      "Shopping list retrieved successfully",
      data
    );
  } catch (err) {
    console.error("Error retrieving shopping list:", err);
    // Add more error info for debugging
    response.InternalServerError(
      res,
      err.message || "Failed to retrieve shopping list"
    );
  }
};

// Update the checkedOff/onHand status of a shopping list item
exports.updateShoppingListItemStatus = async (req, res) => {
  const userId = req.user.userId;
  const { shoppingListItemId, checkedOff, onHand } = req.body;

  // Validate input
  if (!shoppingListItemId) {
    return response.ValidationError(
      res,
      "Invalid or missing shoppingListItemId"
    );
  }
  if (checkedOff === undefined && onHand === undefined) {
    return response.ValidationError(
      res,
      "At least one of checkedOff or onHand must be provided"
    );
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("ShoppingListItemId", sql.Int, Number(shoppingListItemId))
      .input(
        "CheckedOff",
        sql.Bit,
        checkedOff !== undefined ? checkedOff : null
      )
      .input("OnHand", sql.Bit, onHand !== undefined ? onHand : null)
      .execute("UpdateShoppingListItemStatus");

    // Check if any row was updated (result.rowsAffected[0] > 0)
    if (result.rowsAffected && result.rowsAffected[0] === 0) {
      return response.NotFound(
        res,
        "Shopping list item not found or not updated"
      );
    }

    response.SuccessResponseWithOutData(
      res,
      "Shopping list item status updated successfully"
    );
  } catch (err) {
    console.error("Error updating shopping list item status:", err);
    response.InternalServerError(
      res,
      "Failed to update shopping list item status"
    );
  }
};

exports.getUserActionPlanByWeek = async (req, res) => {
  const userId = req.user.userId; // assuming this is a valid UUID string
  const week = parseInt(req.query.week, 10);

  if (!week || isNaN(week)) {
    return response.ValidationError(res, "Missing or invalid week parameter");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("Week", sql.Int, week)
      .execute("GetUserActionPlanByWeek"); // Updated to match the correct stored procedure name

    if (!result.recordset.length) {
      return response.NotFound(res, "No action plan found for the given week");
    }

    let data;
    try {
      // Expecting one column with JSON text
      const key = Object.keys(result.recordset[0])[0];
      const value = result.recordset[0][key];
      if (typeof value === "string" && value.trim().length > 0) {
        data = JSON.parse(value);
      } else {
        data = {};
      }
    } catch (err) {
      console.error("Failed to parse action plan data:", err, result.recordset);
      return response.InternalServerError(
        res,
        "Failed to parse action plan data"
      );
    }

    return response.SuccessResponseWithData(
      res,
      "Action plan retrieved successfully",
      data
    );
  } catch (err) {
    console.error("Error retrieving action plan:", err);
    return response.InternalServerError(
      res,
      err.message || "Failed to retrieve action plan"
    );
  }
};

// Get action plan for a specific date
exports.getUserActionPlanByDate = async (req, res) => {
  const userId = req.user.userId;
  const { date } = req.query;

  if (!date) {
    return response.ValidationError(res, "Missing required parameter: date");
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return response.ValidationError(res, "Date must be in YYYY-MM-DD format");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("Date", sql.Date, date)
      .execute("GetUserActionPlanByDate");

    if (!result.recordset.length) {
      return response.NotFound(res, "No action plan found for the given date");
    }

    let data;
    try {
      // Expecting one column with JSON text
      const key = Object.keys(result.recordset[0])[0];
      const value = result.recordset[0][key];
      if (typeof value === "string" && value.trim().length > 0) {
        data = JSON.parse(value);
      } else {
        data = {};
      }
    } catch (err) {
      console.error("Failed to parse action plan data:", err, result.recordset);
      return response.InternalServerError(
        res,
        "Failed to parse action plan data"
      );
    }

    return response.SuccessResponseWithData(
      res,
      "Action plan retrieved successfully",
      data
    );
  } catch (err) {
    console.error("Error retrieving action plan:", err);
    return response.InternalServerError(
      res,
      err.message || "Failed to retrieve action plan"
    );
  }
};

// Add a user preference (USP_UserPreference_Add)
exports.addUserPreference = async (req, res) => {
  const userId = req.user.userId;
  const { CategoryCode, PreferenceItemId, FreeTextValue, Source, Notes } =
    req.body;

  // Validate required fields
  if (!userId || !CategoryCode) {
    return response.ValidationError(
      res,
      "UserId and CategoryCode are required."
    );
  }

  // Must provide exactly one of PreferenceItemId or FreeTextValue
  const hasItemId = PreferenceItemId !== undefined && PreferenceItemId !== null;
  const hasFreeText =
    FreeTextValue !== undefined &&
    FreeTextValue !== null &&
    String(FreeTextValue).trim() !== "";
  if ((hasItemId && hasFreeText) || (!hasItemId && !hasFreeText)) {
    return response.ValidationError(
      res,
      "Provide exactly one of PreferenceItemId or FreeTextValue."
    );
  }

  try {
    const pool = await connectToDatabase();
    const request = pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("CategoryCode", sql.VarChar(24), CategoryCode)
      .input("PreferenceItemId", sql.Int, hasItemId ? PreferenceItemId : null)
      .input(
        "FreeTextValue",
        sql.NVarChar(200),
        hasFreeText ? FreeTextValue : null
      )
      .input("Source", sql.VarChar(16), Source || "user")
      .input("Notes", sql.NVarChar(400), Notes || null)
      .output("UserPreferenceId", sql.Int);

    await request.execute("usp_UserPreference_Add");
    const userPreferenceId = request.parameters.UserPreferenceId.value;

    return res.status(200).json({
      success: true,
      message: "User preference added successfully.",
      userPreferenceId,
    });
  } catch (err) {
    if (err.number === 50001) {
      return response.ValidationError(res, "Invalid CategoryCode.");
    }
    if (err.number === 50002) {
      return response.ValidationError(
        res,
        "Provide exactly one of PreferenceItemId or FreeTextValue."
      );
    }
    // Other SQL errors
    console.error("Error adding user preference:", err);
    return response.InternalServerError(res, "Failed to add user preference.");
  }
};

// Bulk upsert user preferences (usp_UserPreference_BulkUpsert)
exports.bulkUpsertUserPreferences = async (req, res) => {
  const userId = req.user.userId;
  const { items } = req.body;

  // Validate input
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return response.ValidationError(
      res,
      "UserId and a non-empty items array are required."
    );
  }

  // Validate each item minimally
  for (const item of items) {
    if (!item.CategoryCode) {
      return response.ValidationError(
        res,
        "Each item must have a CategoryCode."
      );
    }
    const hasItemId =
      item.PreferenceItemId !== undefined && item.PreferenceItemId !== null;
    const hasFreeText =
      item.FreeTextValue !== undefined &&
      item.FreeTextValue !== null &&
      String(item.FreeTextValue).trim() !== "";
    if ((hasItemId && hasFreeText) || (!hasItemId && !hasFreeText)) {
      return response.ValidationError(
        res,
        "Each item must provide exactly one of PreferenceItemId or FreeTextValue."
      );
    }
  }

  try {
    const pool = await connectToDatabase();

    // Create a TVP (table-valued parameter) for UserPreference_Input
    const tvp = new sql.Table();
    tvp.columns.add("CategoryCode", sql.VarChar(24));
    tvp.columns.add("PreferenceItemId", sql.Int);
    tvp.columns.add("FreeTextValue", sql.NVarChar(200));
    tvp.columns.add("Source", sql.VarChar(16));
    tvp.columns.add("Notes", sql.NVarChar(400));

    items.forEach((item) => {
      tvp.rows.add(
        item.CategoryCode,
        item.PreferenceItemId !== undefined ? item.PreferenceItemId : null,
        item.FreeTextValue !== undefined ? item.FreeTextValue : null,
        item.Source || "user",
        item.Notes || null
      );
    });

    await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("Items", tvp)
      .execute("usp_UserPreference_BulkUpsert");

    return res.status(200).json({
      success: true,
      message: "User preferences bulk upserted successfully.",
    });
  } catch (err) {
    if (err.message && err.message.includes("PreferenceCategory")) {
      return response.ValidationError(
        res,
        "Invalid CategoryCode in one or more items."
      );
    }
    // Other SQL errors
    console.error("Error bulk upserting user preferences:", err);
    return response.InternalServerError(
      res,
      "Failed to bulk upsert user preferences."
    );
  }
};

// Get user preferences (usp_UserPreference_GetByUser)
exports.getUserPreferences = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return response.ValidationError(res, "UserId is required.");
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("usp_UserPreference_GetByUser");

    return res.status(200).json({
      success: true,
      message: "User preferences retrieved successfully.",
      data: result.recordset || [],
    });
  } catch (err) {
    console.error("Error retrieving user preferences:", err);
    return response.InternalServerError(
      res,
      "Failed to retrieve user preferences."
    );
  }
};

// Get user action plans with goals by date
exports.getUserActionPlansWithGoalsByDate = async (req, res) => {
  const { TargetDate } = req.query;
  const userId = req.user.userId; // Get userId from decoded token

  // Check if user exists
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, "User not found");
  }

  try {
    const pool = await connectToDatabase();
    const request = pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("TargetDate", sql.Date, TargetDate || null);

    const result = await request.execute("GetUserActionPlansWithGoalsByDate");

    // Parse JSON goals for each action plan
    const actionPlans = result.recordset.map((plan) => ({
      ...plan,
      Goals: plan.Goals ? JSON.parse(plan.Goals) : [],
    }));

    return res.status(200).json({
      success: true,
      message: "User action plans with goals retrieved successfully.",
      data: actionPlans,
    });
  } catch (err) {
    console.error("Error fetching user action plans with goals:", err);
    return response.InternalServerError(
      res,
      "Failed to fetch user action plans with goals."
    );
  }
};

// Get user recipes by week with plan details
exports.getUserRecipesByWeek = async (req, res) => {
  const userId = req.user.userId;
  const { currentDate, weekNumber } = req.query;

  // Validate userId
  if (!userId) {
    return response.ValidationError(res, "UserId is required.");
  }

  // Validate date format if provided
  if (currentDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(currentDate)) {
      return response.ValidationError(
        res,
        "CurrentDate must be in YYYY-MM-DD format."
      );
    }
  }

  // Validate weekNumber if provided
  if (weekNumber) {
    const weekNum = parseInt(weekNumber);
    if (isNaN(weekNum) || weekNum < 1) {
      return response.ValidationError(
        res,
        "WeekNumber must be a positive integer."
      );
    }
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("CurrentDate", sql.Date, currentDate || null)
      .execute("GetUserRecipesByWeek");

    if (!result.recordset.length) {
      return response.NotFound(res, "No recipes found for the given week.");
    }

    // The stored procedure returns a single row with JSON data
    let data;
    try {
      const key = Object.keys(result.recordset[0])[0];
      const value = result.recordset[0][key];

      if (value === null) {
        return response.NotFound(
          res,
          "No active diet plan found for the user."
        );
      }

      if (typeof value === "string" && value.trim().length > 0) {
        data = JSON.parse(value);
      } else {
        data = {};
      }
    } catch (err) {
      console.error("Failed to parse recipes data:", err, result.recordset);
      return response.InternalServerError(res, "Failed to parse recipes data.");
    }

    return response.SuccessResponseWithData(
      res,
      "User recipes by week retrieved successfully.",
      data
    );
  } catch (err) {
    console.error("Error retrieving user recipes by week:", err);
    return response.InternalServerError(
      res,
      "Failed to retrieve user recipes by week."
    );
  }
};

// Get user shopping list by diet plan (updated version - current week only)
exports.getUserShoppingListByDietPlanCurrentWeek = async (req, res) => {
  const userId = req.user.userId;
  const { dietPlanTemplateId, currentDate, weekNumber } = req.query;

  if (!userId) {
    return response.ValidationError(res, "UserId is required.");
  }
  if (!dietPlanTemplateId) {
    return response.ValidationError(res, "DietPlanTemplateId is required.");
  }

  // Validate date format if provided
  if (currentDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(currentDate)) {
      return response.ValidationError(
        res,
        "CurrentDate must be in YYYY-MM-DD format."
      );
    }
  }

  // Validate weekNumber if provided
  if (weekNumber) {
    const weekNum = parseInt(weekNumber);
    if (isNaN(weekNum) || weekNum < 1) {
      return response.ValidationError(
        res,
        "WeekNumber must be a positive integer."
      );
    }
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("DietPlanTemplateId", sql.UniqueIdentifier, dietPlanTemplateId)
      .input("CurrentDate", sql.Date, currentDate || null)
      .input("WeekNumber", sql.Int, weekNumber ? parseInt(weekNumber) : null)
      .execute("GetUserShoppingListByDietPlan");

    let shoppingList = [];

    if (result.recordset.length > 0 && result.recordset[0].JsonResult) {
      const parsed = JSON.parse(result.recordset[0].JsonResult);
      shoppingList = parsed.shoppingList || [];
    }

    if (shoppingList.length === 0) {
      return response.NotFound(
        res,
        "No shopping list found for the specified diet plan."
      );
    }

    return response.SuccessResponseWithData(
      res,
      "Shopping list retrieved successfully.",
      shoppingList
    );
  } catch (err) {
    console.error("Error retrieving shopping list:", err);
    return response.InternalServerError(
      res,
      "Failed to retrieve shopping list."
    );
  }
};

// Get user's wishlist (recipes)
exports.getUserWishlist = async (req, res) => {
  const userId = req.user.userId;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "UserId is required." });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .execute("GetUserWishlist");
    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully.",
      data: result.recordset || [],
    });
  } catch (err) {
    if (err.number === 50000) {
      return res
        .status(400)
        .json({ success: false, message: "UserId is required." });
    }
    if (err.number === 50002) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    console.error("Error retrieving wishlist:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to retrieve wishlist." });
  }
};

// Add/remove a recipe from user's wishlist
exports.toggleWishlistItem = async (req, res) => {
  const userId = req.user.userId;
  const { RecipeId, IsWishlisted } = req.body;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "UserId is required." });
  }
  if (!RecipeId) {
    return res
      .status(400)
      .json({ success: false, message: "RecipeId is required." });
  }
  if (
    typeof IsWishlisted !== "boolean" &&
    IsWishlisted !== 0 &&
    IsWishlisted !== 1
  ) {
    return res
      .status(400)
      .json({ success: false, message: "IsWishlisted must be a boolean." });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, userId)
      .input("RecipeId", sql.UniqueIdentifier, RecipeId)
      .input("IsWishlisted", sql.Bit, IsWishlisted ? 1 : 0)
      .execute("ToggleWishlistItem");
    return res.status(200).json({
      success: true,
      message: IsWishlisted
        ? "Recipe added to wishlist."
        : "Recipe removed from wishlist.",
      status:
        result.recordset && result.recordset[0]
          ? result.recordset[0].Status
          : "Success",
    });
  } catch (err) {
    if (err.number === 50000) {
      return res
        .status(400)
        .json({ success: false, message: "UserId is required." });
    }
    if (err.number === 50001) {
      return res
        .status(400)
        .json({ success: false, message: "RecipeId is required." });
    }
    if (err.number === 50002) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    if (err.number === 50003) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found." });
    }
    console.error("Error toggling wishlist item:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update wishlist." });
  }
};
