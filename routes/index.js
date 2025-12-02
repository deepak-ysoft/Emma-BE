const express = require("express");
const router = express.Router();
const blobRoutes = require("./blobRoutes");
const authRoutes = require("./authRoutes");
const labRoutes = require("./labRoutes");
const kitRoutes = require("./kitRoutes");
const actionRoutes = require("./actionRoutes");
const homeRoutes = require("./homeRoutes");
const progressRoutes = require("./progressRoutes"); // Add this line
const profileRoutes = require("./profileRoutes");
const resultRoutes = require("./resultRoutes");
const adminRoutes = require("./adminRoutes");
const recipeRoute = require("./recipeRoute");
const aiChatBotRoute = require("./aiChatbotRoute");
const weeklyCheckInRoute = require("./weeklyCheckRoute");

// result routes
router.use(resultRoutes);

// Use auth routes
router.use("/auth", authRoutes);

// Blob routes
router.use(blobRoutes);

// Lab routes
router.use("/result", labRoutes);

// Kit routes
router.use("/kit", kitRoutes);

// Action routes
router.use(actionRoutes);

// Home routes
router.use("/home", homeRoutes);

// Progress routes
router.use(progressRoutes); // Add this line

// Profile routes
router.use("/profile", profileRoutes);

// Admin routes
router.use("/admin", adminRoutes);

// Analyse recipes routes
router.use("/recipes", recipeRoute);

//AI chat route
router.use("/aiChat", aiChatBotRoute);

// Weekly check in routes
router.use(weeklyCheckInRoute);

module.exports = router;
