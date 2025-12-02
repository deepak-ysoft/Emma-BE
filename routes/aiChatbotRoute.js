const express = require("express");
const authenticateToken = require("../middleware/authenticate");
const aiChatBotController = require("../controllers/aiChatBotController");

const router = express.Router();

/**
 * @swagger
 * /api/chatbot/start-chat:
 *   get:
 *     summary: Start an AI chatbot session and generate access token
 *     tags: [AI Chatbot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat session created successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     session_id:
 *                       type: string
 *                       example: "a8s7d6as7d6as7d6as7d"
 *                     token:
 *                       type: string
 *                       example: "Bearer eyJhbGciOiJIUz..."
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/start-chat", authenticateToken, aiChatBotController.chatBot);

/**
 * @swagger
 * /api/chatbot/assistant:
 *   post:
 *     summary: Send a message to the AI assistant and store chat history
 *     tags: [AI Chatbot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - prompt
 *               - accessToken
 *             properties:
 *               session_id:
 *                 type: string
 *                 example: "session-123"
 *               prompt:
 *                 type: string
 *                 example: "What should I eat for a low FODMAP breakfast?"
 *               history:
 *                 type: array
 *                 description: Not used (always sent empty)
 *                 items:
 *                   type: string
 *               accessToken:
 *                 type: string
 *                 example: "Bearer ai-generated-token"
 *     responses:
 *       200:
 *         description: AI reply generated
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
 *                   properties:
 *                     reply:
 *                       type: string
 *                       example: "A low FODMAP breakfast option is scrambled eggs with spinach."
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/assistant", authenticateToken, aiChatBotController.chatAssistant);

/**
 * @swagger
 * /api/chatbot/history:
 *   get:
 *     summary: Get paginated chat history for the AI assistant
 *     tags: [AI Chatbot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paged chat history retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Prompt:
 *                         type: string
 *                       Response:
 *                         type: string
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/history", authenticateToken, aiChatBotController.getChatHistory);

module.exports = router;
