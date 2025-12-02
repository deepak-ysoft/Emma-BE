require("dotenv").config();
const sql = require("mssql");

// Database configuration object
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10),
};

const connectToDatabase = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (err) {
    throw new Error("Database connection failed: " + err.message);
  }
};

module.exports = {
  dbConfig,
  connectToDatabase,
};
