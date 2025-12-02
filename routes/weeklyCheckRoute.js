const express = require("express");
const authenticateToken = require("../middleware/authenticate");
const weeklyCheckInController = require("../controllers/weeklyCheckinController");
const router = express.Router();

/**
 * @swagger
 * /api/weekly/weekly-checkin:
 *   post:
 *     summary: Save weekly check-in data
 *     tags: [Weekly Check-In]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formType
 *               - date
 *               - scores
 *               - totalScore
 *             properties:
 *               formType:
 *                 type: string
 *                 example: "IBS-QOL"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-20"
 *               scores:
 *                 type: object
 *                 example:
 *                   Q1:
 *                     section: "Physical Functioning"
 *                     question: "How often did you feel discomfort?"
 *                     answerLabel: "Sometimes"
 *                     answerValue: 3
 *               totalScore:
 *                 type: number
 *                 example: 28.5
 *     responses:
 *       200:
 *         description: Weekly check-in saved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/weekly-checkin",
  authenticateToken,
  weeklyCheckInController.saveWeeklyCheckin
);

/**
 * @swagger
 * /api/weekly/weekly-checkin:
 *   get:
 *     summary: Get weekly check-in data for a selected date
 *     tags: [Weekly Check-In]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Week start date for which to fetch check-in data
 *     responses:
 *       200:
 *         description: Weekly check-in retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: Parsed JSON data stored in DB
 *       400:
 *         description: Date is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/weekly-checkin",
  authenticateToken,
  weeklyCheckInController.getWeeklycheckIn
);

module.exports = router;
