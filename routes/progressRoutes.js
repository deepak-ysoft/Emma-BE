const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authenticateToken = require('../middleware/authenticate');

// /**
//  * @swagger
//  * tags:
//  *   name: Progress
//  *   description: API for managing user progress data
//  */

// /**
//  * @swagger
//  * /api/progress:
//  *   get:
//  *     summary: Get general progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve progress data"
//  */
// router.get('/progress', authenticateToken, progressController.getProgressByUser);

// /**
//  * @swagger
//  * /api/progress:
//  *   post:
//  *     summary: Log daily progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             example:
//  *               sleep: { from: "2025-03-18", timeFrom: "22:15", to: "2025-03-18", timeTo: "09:32", note: "text", tags: ["tag 1", "tag 2"] }
//  *               symptom: { date: "2025-03-18", time: "10:04", selected: [{ name: "A feeling of heaviness in the stomach", value: 5, tags: ["test", "other"], note: "text" }, { name: "Constipation (IBS-C)", value: 2, tags: ["test", "other"], note: "text" }] }
//  *               bowel: { movement: true, consistency: "pellets", color: 1, size: "small", date: "2025-03-18", time: "09:32", note: "text", tags: ["mucus", "urgency"] }
//  *               medicine: { selected: [{ name: "Antibiotic", date: "2025-03-18", time: "10:04", quantity: "1/4", value: 5, tags: ["test", "other"], note: "text" }, { name: "Antibacterial Hand Soap .13g", date: "2025-03-18", time: "10:04", quantity: "4", value: 2, tags: ["test", "other"], note: "text" }] }
//  *               food: { name: "salad", energy: 200, fat: 100, date: "2025-03-18", time: "09:32", note: "text", tags: ["green-salad"] }
//  *               mood: { value: 2, date: "2025-03-18", time: "09:32", note: "text", tags: ["calm", "lonely"] }
//  *               energy: { value: 2, date: "2025-03-18", time: "09:32", note: "text" }
//  *               alcohol: { number: "1/2", date: "2025-03-18", time: "09:32", note: "text", tags: ["beer"] }
//  *               water: { number: 250, date: "2025-03-18", time: "09:32", note: "text" }
//  *               caffeine: { name: "black-tea", number: 30, serving: "1/2", date: "2025-03-18", time: "09:32", note: "text", tags: ["ristreto"] }
//  *               activity: { name: "dancing", title: "jazz", date: "2025-03-18", timeFrom: "09:32", timeTo: "11:32", calories: 500, intensity: "low", note: "text" }
//  *     responses:
//  *       200:
//  *         description: Progress data logged successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Progress data logged successfully"
//  *       404:
//  *         description: User not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "User not found"
//  *       500:
//  *         description: Failed to log progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to log progress data"
//  */
// router.post('/progress', authenticateToken, progressController.logDailyProgress);

// /**
//  * @swagger
//  * /api/progress/symptom:
//  *   get:
//  *     summary: Get symptom progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Symptom progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No symptom progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No symptom progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve symptom progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve symptom progress data"
//  */
// router.get('/progress/symptom', authenticateToken, progressController.getSymptomProgressByUser);

// /**
//  * @swagger
//  * /api/progress/activity:
//  *   get:
//  *     summary: Get activity progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Activity progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No activity progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No activity progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve activity progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve activity progress data"
//  */
// router.get('/progress/activity', authenticateToken, progressController.getActivityProgressByUser);

// /**
//  * @swagger
//  * /api/progress/food:
//  *   get:
//  *     summary: Get food progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Food progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No food progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No food progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve food progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve food progress data"
//  */
// router.get('/progress/food', authenticateToken, progressController.getFoodProgressByUser);

// /**
//  * @swagger
//  * /api/progress/bowel:
//  *   get:
//  *     summary: Get bowel progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Bowel progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No bowel progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No bowel progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve bowel progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve bowel progress data"
//  */
// router.get('/progress/bowel', authenticateToken, progressController.getBowelProgressByUser);

// /**
//  * @swagger
//  * /api/progress/sleep:
//  *   get:
//  *     summary: Get sleep progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Sleep progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No sleep progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No sleep progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve sleep progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve sleep progress data"
//  */
// router.get('/progress/sleep', authenticateToken, progressController.getSleepProgressByUser);

// /**
//  * @swagger
//  * /api/progress/alcohol:
//  *   get:
//  *     summary: Get alcohol progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Alcohol progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No alcohol progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No alcohol progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve alcohol progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve alcohol progress data"
//  */
// router.get('/progress/alcohol', authenticateToken, progressController.getAlcoholProgressByUser);

// /**
//  * @swagger
//  * /api/progress/caffeine:
//  *   get:
//  *     summary: Get caffeine progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Caffeine progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No caffeine progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No caffeine progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve caffeine progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve caffeine progress data"
//  */
// router.get('/progress/caffeine', authenticateToken, progressController.getCaffeineProgressByUser);

// /**
//  * @swagger
//  * /api/progress/energy:
//  *   get:
//  *     summary: Get energy progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Energy progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No energy progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No energy progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve energy progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve energy progress data"
//  */
// router.get('/progress/energy', authenticateToken, progressController.getEnergyProgressByUser);

// /**
//  * @swagger
//  * /api/progress/water:
//  *   get:
//  *     summary: Get water progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Water progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No water progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No water progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve water progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve water progress data"
//  */
// router.get('/progress/water', authenticateToken, progressController.getWaterProgressByUser);

// /**
//  * @swagger
//  * /api/progress/mood:
//  *   get:
//  *     summary: Get mood progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Mood progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No mood progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No mood progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve mood progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve mood progress data"
//  */
// router.get('/progress/mood', authenticateToken, progressController.getMoodProgressByUser);

// /**
//  * @swagger
//  * /api/progress/medicine:
//  *   get:
//  *     summary: Get medicine progress data for the authenticated user
//  *     tags: [Progress]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The start date in YYYY-MM-DD format
//  *       - in: query
//  *         name: endDate
//  *         required: false
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: The end date in YYYY-MM-DD format
//  *     responses:
//  *       200:
//  *         description: Medicine progress data retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     progressTracking:
//  *                       type: object
//  *                       additionalProperties:
//  *                         type: array
//  *                         items:
//  *                           type: object
//  *                           properties:
//  *                             value:
//  *                               type: number
//  *                             dataValues:
//  *                               type: array
//  *                               items:
//  *                                 type: number
//  *                             history:
//  *                               type: array
//  *                               items:
//  *                                 type: object
//  *                                 properties:
//  *                                   date:
//  *                                     type: string
//  *                                     format: date
//  *                                   label:
//  *                                     type: string
//  *                                   value:
//  *                                     type: number
//  *       404:
//  *         description: No medicine progress data found for the given user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "No medicine progress data found for the given user"
//  *       500:
//  *         description: Failed to retrieve medicine progress data
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: false
//  *                 message:
//  *                   type: string
//  *                   example: "Failed to retrieve medicine progress data"
//  */
// router.get('/progress/medicine', authenticateToken, progressController.getMedicineProgressByUser);

module.exports = router;