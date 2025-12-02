const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authenticateToken = require('../middleware/authenticate'); 

/**
 * @swagger
 * /api/result:
 *   get:
 *     summary: Get the current user's result report as JSON
 *     tags:
 *       - Result
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JSON result report for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   OrderNo:
 *                     type: string
 *                   DownloadUrl:
 *                     type: string
 *                   DisplayStatus:
 *                     type: string
 *                   StatusDate:
 *                     type: string
 *                     format: date-time
 *                   CreateDate:
 *                     type: string
 *                     format: date-time
 *                   UpdateDate:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Missing userId
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get('/result', authenticateToken, resultController.getUserResultReport);

module.exports = router;
