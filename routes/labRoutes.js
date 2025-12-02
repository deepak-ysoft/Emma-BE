const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');
const authenticateToken = require('../middleware/authenticate'); // Add this line

/**
 * @swagger
 * /api/result/index/{kitOrderId}:
 *   get:
 *     summary: Get results by Kit Order ID
 *     tags: [Lab]
 *     parameters:
 *       - in: path
 *         name: kitOrderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Kit Order ID
 *     responses:
 *       200:
 *         description: Results retrieved successfully
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
 *         description: No results found for the given Kit Order ID
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
 *                   example: "No results found for the given Kit Order ID"
 *       500:
 *         description: Failed to retrieve results
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
 *                   example: "Failed to retrieve results"
 */
router.get('/index/:kitOrderId', authenticateToken, labController.getResultsByKit); // Add authenticateToken

/**
 * @swagger
 * /api/result/detail:
 *   get:
 *     summary: Get lab result detail by metric
 *     tags: [Lab]
 *     parameters:
 *       - in: query
 *         name: kitOrderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Kit Order ID
 *       - in: query
 *         name: metricId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The Metric ID
 *     responses:
 *       200:
 *         description: Lab result details retrieved successfully
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
 *         description: No lab result details found for the given Kit Order ID and Metric ID
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
 *                   example: "No lab result details found for the given Kit Order ID and Metric ID"
 *       500:
 *         description: Failed to retrieve lab result details
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
 *                   example: "Failed to retrieve lab result details"
 */
router.get('/detail', authenticateToken, labController.getLabResultDetailByMetric); // Add authenticateToken

/**
 * @swagger
 * /api/result/orders/{orderNo}:
 *   get:
 *     summary: Fetches lab order details
 *     tags: [Lab]
 *     parameters:
 *       - in: path
 *         name: orderNo
 *         required: true
 *         schema:
 *           type: string
 *         description: The Order Number
 *     responses:
 *       200:
 *         description: Lab order details retrieved successfully
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
 *                     LabOrderDetailId:
 *                       type: integer
 *                       example: 1
 *                     OrderNo:
 *                       type: string
 *                       example: "ORD123456"
 *                     DateCollected:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:34:56Z"
 *                     DateReceived:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-02T12:34:56Z"
 *                     DateReported:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-03T12:34:56Z"
 *                     OrderComments:
 *                       type: string
 *                       example: "Sample comments"
 *                     LabComments:
 *                       type: string
 *                       example: "Lab comments"
 *                     PhysicianName:
 *                       type: string
 *                       example: "Dr. John Doe"
 *                     GdxClientId:
 *                       type: string
 *                       example: "GDX123"
 *                     PatientId:
 *                       type: integer
 *                       example: 12345
 *                     PatientAge:
 *                       type: integer
 *                       example: 30
 *                     CreateDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:34:56Z"
 *                     UpdateDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-02T12:34:56Z"
 *                     LabOrderHeaderId:
 *                       type: integer
 *                       example: 1
 *                     MemberId:
 *                       type: integer
 *                       example: 1
 *                     PatientFirstName:
 *                       type: string
 *                       example: "John"
 *                     PatientLastName:
 *                       type: string
 *                       example: "Doe"
 *                     PatientDateOfBirth:
 *                       type: string
 *                       format: date-time
 *                       example: "1990-01-01T00:00:00Z"
 *       404:
 *         description: Lab order not found
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
 *                   example: "Lab order not found"
 *       500:
 *         description: Failed to retrieve lab order details
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
 *                   example: "Failed to retrieve lab order details"
 */
router.get('/orders/:orderNo', authenticateToken, labController.getLabOrderDetails); // Add authenticateToken

module.exports = router;



