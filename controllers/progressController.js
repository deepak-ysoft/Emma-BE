const { connectToDatabase } = require('../config/config');
const sql = require('mssql');
const response = require('../common/response');
const { getUserById } = require('../helpers/userHelper');

// Fetches progress data by user
exports.getProgressByUser = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token
  const { startDate, endDate } = req.query;

  // Check if user exists
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, 'User not found');
  }

  // Validate date format if provided
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if ((startDate && !dateRegex.test(startDate)) || (endDate && !dateRegex.test(endDate))) {
    return response.ValidationError(res, 'Start date and end date must be in YYYY-MM-DD format');
  }

  try {
    const pool = await connectToDatabase();
    const request = pool.request()
      .input('UserId', sql.NVarChar(450), userId)
      .input('StartDate', sql.DateTime2, startDate ? new Date(startDate) : null)
      .input('EndDate', sql.DateTime2, endDate ? new Date(endDate) : null);

    // Execute the stored procedure
    const result = await request.execute('pwa_GetProgressByUser');

    // Check if there are any result sets
    if (!result.recordsets || result.recordsets.length === 0) {
      return response.NotFound(res, 'No progress data found for the given user');
    }

    // Process all result sets
    const allData = result.recordsets.map(recordset => {
      return recordset.map(record => {
        const key = Object.keys(record)[0]; // Get the dynamic key (e.g., JSON_F52E2B61-18A1-11d1-B105-00805F49916B)
        return JSON.parse(record[key]); // Parse the JSON string
      });
    });

    // Flatten the array of result sets into a single array
    const flattenedData = allData.flat();

    // Transform the data into the desired structure
    const progressTracking = {};

    flattenedData.forEach(item => {
      const category = Object.keys(item)[0]; // Get the category (e.g., symptom, bowel, food, etc.)
      const categoryData = item[category][0]; // Get the data for the category

      // Map the data to the desired structure
      progressTracking[category] = [
        {
          value: categoryData.value,
          dataValues: JSON.parse(categoryData.DataValues), // Convert string to array
          history: categoryData.history.map(entry => ({
            date: entry.date.split('T')[0], // Remove time from the date
            label: entry.label || "No data", // Use "No data" if label is missing or false
            value: entry.value
          }))
        }
      ];
    });

    // Return the transformed data
    response.SuccessResponseWithData(res, 'Progress data retrieved successfully', { progressTracking });
  } catch (err) {
    console.error('Error retrieving progress data by user:', err);
    response.InternalServerError(res, 'Failed to retrieve progress data');
  }
};

const getProgress = async (req, res, procedureName) => {
  const userId = req.user.userId; // Get userId from decoded token
  const { startDate, endDate } = req.query;

  // Check if user exists
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, 'User not found');
  }

  // Validate date format if provided
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if ((startDate && !dateRegex.test(startDate)) || (endDate && !dateRegex.test(endDate))) {
    return response.ValidationError(res, 'Start date and end date must be in YYYY-MM-DD format');
  }

  try {
    const pool = await connectToDatabase();
    const request = pool.request()
      .input('UserId', sql.NVarChar(450), userId)
      .input('StartDate', sql.DateTime2, startDate ? new Date(startDate) : null)
      .input('EndDate', sql.DateTime2, endDate ? new Date(endDate) : null);

    // Execute the stored procedure
    const result = await request.execute(procedureName);

    // Check if there are any result sets
    if (!result.recordset || result.recordset.length === 0) {
      return response.NotFound(res, 'No progress data found for the given user');
    }

    // Extract and parse JSON data from response
    const extractedData = result.recordset.map((record) => {
      const key = Object.keys(record)[0]; // Get the first key dynamically
      try {
        return JSON.parse(record[key]); // Parse the JSON
      } catch (err) {
        console.error(`Error parsing JSON from response:`, err);
        return null; // Return null if parsing fails
      }
    }).filter(data => data !== null); // Remove any null values due to parsing errors

    // Return the transformed data
    return response.SuccessResponseWithData(res, 'Progress data retrieved successfully', extractedData);

  } catch (err) {
    console.error(`Error retrieving progress data for ${procedureName}:`, err);
    return response.InternalServerError(res, 'Failed to retrieve progress data');
  }
};

// Logs daily progress data for the user
exports.logDailyProgress = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token
  const progressData = req.body; // Get progress data from request body

  // Check if user exists
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, 'User not found');
  }

  try {
    const pool = await connectToDatabase();
    const request = pool.request()
      .input('UserId', sql.NVarChar(450), userId)
      .input('json', sql.NVarChar(sql.MAX), JSON.stringify(progressData));

    // Execute the stored procedure
    const result =  await request.execute('pwa_LogDailyProgress');

    // Return success response
    response.SuccessResponseWithOutData(res, 'Progress data logged successfully');
    // response.SuccessResponseWithData(res, 'Progress data logged successfully',result);
  } catch (err) {
    console.error('Error logging progress data:', err);
    response.InternalServerError(res, 'Failed to log progress data');
  }
};

// Define endpoints for each procedure
exports.getSymptomProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetSymptomProgressByUser');
exports.getActivityProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetActivityProgressByUser');
exports.getFoodProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetFoodProgressByUser');
exports.getBowelProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetBowelProgressByUser');
exports.getSleepProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetSleepProgressByUser');
exports.getAlcoholProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetAlcoholProgressByUser');
exports.getCaffeineProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetCaffeineProgressByUser');
exports.getEnergyProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetEnergyProgressByUser');
exports.getWaterProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetWaterProgressByUser');
exports.getMoodProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetMoodProgressByUser');
exports.getMedicineProgressByUser = (req, res) => getProgress(req, res, 'pwa_GetMedicineProgressByUser');
