const { connectToDatabase } = require('../config/config');
const sql = require('mssql');
const response = require('../common/response');
const { getUserById } = require('../helpers/userHelper');

exports.getUserResultReport = async (req, res) => {
  const userId = req.user.userId;

  // Check if userId is provided and valid
  if (!userId) {
    return response.ValidationError(res, 'User ID is required');
  }

  // Check if user exists
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, 'User not found');
  }

  try {
    // Validate GUID format if needed
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(userId)) {
      return response.ValidationError(res, 'Invalid User ID format');
    }

    const pool = await connectToDatabase();
    const request = pool.request()
      .input('UserId', sql.UniqueIdentifier, userId);

    // Execute the stored procedure
    const result = await request.execute('GetUserResultReportJson');

    // Check if there are any results
    if (!result.recordset || result.recordset.length === 0) {
      return response.SuccessResponseWithData(res, 'No reports found for the user', []);
    }

    // Handle different possible JSON output formats
    let jsonData;
    const firstRecord = result.recordset[0];
    
    // Check if the JSON is in a named column (common with FOR JSON)
    const jsonColumn = Object.keys(firstRecord).find(key => 
      key.startsWith('JSON_') || key === ''
    );
    
    if (jsonColumn) {
      try {
        jsonData = firstRecord[jsonColumn] ? JSON.parse(firstRecord[jsonColumn]) : [];
      } catch (parseError) {
        // If parsing fails, return the raw data
        jsonData = firstRecord[jsonColumn] || [];
      }
    } else {
      // If no JSON column found, assume the entire recordset is the data
      jsonData = result.recordset;
    }

    // Return the JSON data
    return response.SuccessResponseWithData(res, 'User result reports retrieved successfully', jsonData);
  } catch (err) {
    console.error('Error retrieving user result reports:', err);
    return response.InternalServerError(res, 'Failed to retrieve user result reports');
  }
};