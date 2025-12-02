const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authenticateToken = require('../middleware/authenticate'); // Add this line

/**
 * @swagger
 * /api/home/cards:
 *   get:
 *     summary: Get cards for the authenticated user
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No cards found for the given user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No cards found for the given user"
 *       500:
 *         description: Failed to retrieve cards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve cards"
 */
router.get('/cards', authenticateToken, homeController.getCardsByUserId); // Remove userId from path

/**
 * @swagger
 * /api/home/card-status/{cardId}:
 *   post:
 *     summary: Update card status
 *     tags: [Home]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Completed"
 *               userComment:
 *                 type: string
 *                 example: "This is a user comment"
 *     responses:
 *       200:
 *         description: Card status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Card status updated successfully"
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Status must be either 'Completed' or 'Dismissed'"
 *       500:
 *         description: Failed to update card status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to update card status"
 */
router.post(
  '/card-status/:cardId',
  authenticateToken,
  [
    body('status').isIn(['Completed', 'Dismissed']).withMessage('Status must be either "Completed" or "Dismissed"')
  ],
  homeController.updateCardStatus
); // Remove userId from path

/**
 * @swagger
 * /api/home/challenge/random:
 *   get:
 *     summary: Get a random challenge for the authenticated user
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Random challenge retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                     Title:
 *                       type: string
 *                     Description:
 *                       type: string
 *                     WhyItMatters:
 *                       type: string
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                     UpdatedAt:
 *                       type: string
 *                       format: date-time
 *                     IsCompleted:
 *                       type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: No challenge found
 *       500:
 *         description: Failed to retrieve random challenge
 */
router.get('/challenge/random', authenticateToken, homeController.getRandomChallengeForUser);

/**
 * @swagger
 * /api/home/challenge/status:
 *   put:
 *     summary: Update the user's challenge status (complete/incomplete)
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               challengeId:
 *                 type: string
 *                 format: uuid
 *                 example: "e7b8c8e2-9c2b-4b7e-8a2e-123456789abc"
 *               isCompleted:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Challenge status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to update challenge status
 */
router.put('/challenge/status', authenticateToken, homeController.updateUserChallengeStatus);

/**
 * @swagger
 * /api/home/learning-video:
 *   get:
 *     summary: Get today's learning video for the authenticated user (or a fallback)
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning video retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       format: uuid
 *                     Title:
 *                       type: string
 *                     Description:
 *                       type: string
 *                     VideoUrl:
 *                       type: string
 *                     ThumbnailUrl:
 *                       type: string
 *                     Duration:
 *                       type: integer
 *                     IsWatched:
 *                       type: boolean
 *                     WatchedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Learning video retrieved successfully"
 *       404:
 *         description: No learning video found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No learning video found"
 *       500:
 *         description: Failed to retrieve learning video
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve learning video"
 */
router.get('/learning-video', authenticateToken, homeController.getLearningVideoForUser);

module.exports = router;
