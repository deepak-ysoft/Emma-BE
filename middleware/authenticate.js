const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware to authenticate and verify JWT tokens.
 * Ensures that only authorized users can access protected routes.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} res - The response object to send back responses.
 * @param {Function} next - Callback function to pass control to the next middleware.
 */
const authenticateToken = (req, res, next) => {
  // Retrieve the Authorization header
  const authHeader = req.headers["authorization"];

  // Extract the token from the header if present (Format: "Bearer <token>")
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, return an unauthorized response
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token is missing or invalid" });
  }

  // Verify the JWT token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    // Attach the decoded user data to the request object for later use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = authenticateToken;
