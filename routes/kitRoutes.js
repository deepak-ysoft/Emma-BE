const express = require('express');
const router = express.Router();
const kitController = require('../controllers/kitController');
const authenticateToken = require('../middleware/authenticate'); // Add this line

/**
 * @swagger
 * /api/kit/activated_list:
 *   get:
 *     summary: Get activated kits for the authenticated user
 *     tags: [Kit]
 *     responses:
 *       200:
 *         description: Activated kits retrieved successfully
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
 *         description: No activated kits found for the given user
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
 *                   example: "No activated kits found for the given user"
 *       500:
 *         description: Failed to retrieve activated kits
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
 *                   example: "Failed to retrieve activated kits"
 */
router.get('/activated_list', authenticateToken, kitController.getKitsByUser); // Remove userId from path

module.exports = router;
