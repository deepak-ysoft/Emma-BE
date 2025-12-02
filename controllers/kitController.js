const { connectToDatabase } = require('../config/config');
const sql = require('mssql');
const response = require('../common/response');
const { getUserById } = require('../helpers/userHelper'); // Add this line

// Get activated kits by user
exports.getKitsByUser = async (req, res) => {
  const userId = req.user.userId; // Get userId from decoded token

  // Check if user exists
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, 'User not found');
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('UserId', sql.NVarChar, userId)
      .execute('pwa_GetKitByUser');

    if (result.recordset.length === 0) {
      return response.NotFound(res, 'No activated kits found for the given user');
    }

    response.SuccessResponseWithData(res, 'Activated kits retrieved successfully', result.recordset);
  } catch (err) {
    console.error('Error retrieving activated kits by user:', err);
    response.InternalServerError(res, 'Failed to retrieve activated kits');
  }
};
