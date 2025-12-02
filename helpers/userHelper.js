// Import the database connection function and SQL module
const { connectToDatabase } = require('../config/config');
const sql = require('mssql');

//Fetches a user from the database based on their email address.
const getUserByEmail = async (email) => {
    try {
        // Establish a connection to the database
        const pool = await connectToDatabase();

        // Execute the query to find the user by email
        const result = await pool.request()
            .input('Email', sql.NVarChar(256), email)
            .query('SELECT * FROM Users WHERE Email = @Email');

        // Return the first matching user or null if not found
        return result.recordset[0] || null;
    } catch (err) {
        // Handle errors and provide meaningful messages
        throw new Error('Failed to retrieve user by email: ' + err.message);
    }
};

// Helper function to get user by ID
const getUserById = async (userId) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.request()
            .input('Id', sql.NVarChar, userId)
            .query('SELECT * FROM Users WHERE Id = @Id');

        return result.recordset[0];
    } catch (err) {
        console.error('Error retrieving user by ID:', err);
        return null;
    }
};

module.exports = {
    getUserByEmail,
    getUserById
};
