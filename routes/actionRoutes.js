const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const authenticateToken = require('../middleware/authenticate'); // Add this line
const multer = require("multer");
const upload = multer(); // To parse multipart form-data

/**
 * @swagger
 * /api/action-plans:
 *   get:
 *     summary: Get action plans for the authenticated user
 *     tags: [Action]
 *     responses:
 *       200:
 *         description: Action plans retrieved successfully
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
 *         description: No action plans found for the given user
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
 *                   example: "No action plans found for the given user"
 *       500:
 *         description: Failed to retrieve action plans
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
 *                   example: "Failed to retrieve action plans"
 */
router.get('/action-plans', authenticateToken, actionController.getActionPlansByUserId); // Remove userId from path

/**
 * @swagger
 * /api/action-plan-details/{orderNo}:
 *   get:
 *     summary: Get action plan details by lab order ID
 *     tags: [Action]
 *     parameters:
 *       - in: path
 *         name: orderNo
 *         required: true
 *         schema:
 *           type: string
 *         description: The lab order number
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Action plan details retrieved successfully
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
 *         description: No action plan details found for the given lab order
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
 *                   example: "No action plan details found for the given lab order"
 *       500:
 *         description: Failed to retrieve action plan details
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
 *                   example: "Failed to retrieve action plan details"
 */
router.get('/action-plan-details/:orderNo', authenticateToken, actionController.getActionPlanDetailsByLabOrderId); // Add authenticateToken

/**
 * @swagger
 * /api/action-plan/week:
 *   get:
 *     summary: Get the user's action plan for a given week
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: week
 *         required: true
 *         schema:
 *           type: integer
 *         description: The week number
 *     responses:
 *       200:
 *         description: Action plan for the given week
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
 *       400:
 *         description: Invalid input
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
 *                   example: "Missing or invalid week parameter"
 *       404:
 *         description: No action plan found
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
 *                   example: "No action plan found for the given week"
 *       500:
 *         description: Failed to retrieve action plan
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
 *                   example: "Failed to retrieve action plan"
 */
router.get('/action-plan/week', authenticateToken, actionController.getUserActionPlanByWeek);


/**
 * @swagger
 * /api/action-plan/date:
 *   get:
 *     summary: Get the user's action plan for a specific date
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date to get the action plan for (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Action plan for the given date
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
 *       400:
 *         description: Missing or invalid date parameter
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
 *                   example: "Missing required parameter: date"
 *       404:
 *         description: No action plan found for the given date
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
 *                   example: "No action plan found for the given date"
 *       500:
 *         description: Failed to retrieve action plan
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
 *                   example: "Failed to retrieve action plan"
 */
router.get('/action-plan/date', authenticateToken, actionController.getUserActionPlanByDate);


/**
 * @swagger
 * /api/action-plan/:orderNo:
 *   get:
 *     summary: Get action plan data by kit order
 *     tags: [Action]
 *     parameters:
 *       - in: path
 *         name: orderNo
 *         required: true
 *         schema:
 *           type: string
 *         description: The kit order number
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Action plan data retrieved successfully
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
 *         description: No action plan data found for the given kit order
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
 *                   example: "No action plan data found for the given kit order"
 *       500:
 *         description: Failed to retrieve action plan data
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
 *                   example: "Failed to retrieve action plan data"
 */
router.get('/action-plan/:orderNo', authenticateToken, actionController.getActionPlanByKit); // Add authenticateToken

/**
 * @swagger
 * /api/log-energy-progress:
 *   post:
 *     summary: Log energy progress and upload a file
 *     tags: [Energy]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               EnergyLevel:
 *                 type: integer
 *                 description: "The energy level of the user"
 *               LogDate:
 *                 type: string
 *                 format: date
 *                 description: "The date of the log (format: yyyy-MM-dd)"
 *               LogTime:
 *                 type: string
 *                 format: time
 *                 description: "The time of the log (format: hh:mm)" # Update description
 *               Notes:
 *                 type: string
 *                 description: "Additional notes"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "The file to upload"
 *     responses:
 *       200:
 *         description: "Energy progress logged successfully"
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
 *                   example: "Energy progress logged successfully"
 *                 data:
 *                   type: object
 *       500:
 *         description: "Failed to log energy progress"
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
 *                   example: "Failed to log energy progress"
 */

router.post('/log-energy-progress', authenticateToken, upload.single('file'), actionController.logEnergyProgress);

/**
 * @swagger
 * /api/survey-answers:
 *   post:
 *     summary: Store survey answers
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               json:
 *                 type: object
 *                 description: Survey answers in JSON format
 *     responses:
 *       200:
 *         description: Survey answers stored successfully
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
 *                   example: "Survey answers stored successfully"
 *       500:
 *         description: Failed to store survey answers
 */
router.post('/survey-answers', authenticateToken, actionController.postSurveyAnswers);

/**
 * @swagger
 * /api/learning-library:
 *   get:
 *     summary: Get learning library content
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning library content retrieved successfully
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
 *         description: No learning library content found
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
 *                   example: "No learning library content found"
 *       500:
 *         description: Failed to retrieve learning library content
 */
router.get('/learning-library', authenticateToken, actionController.getLearningLibraryContent);

/**
 * @swagger
 * /api/onboarding:
 *   get:
 *     summary: Get onboarding data for the authenticated user
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onboarding data retrieved successfully
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
 *                   example: "Onboarding data retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: integer
 *                       example: 1
 *                     UserId:
 *                       type: string
 *                       example: "user-123-abc"
 *                     Answers:
 *                       type: object
 *                       description: Parsed JSON object containing onboarding answers
 *                       example: {"question1": "answer1", "question2": "answer2"}
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-14T12:34:56Z"
 *       400:
 *         description: Missing userId
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
 *                   example: "Missing userId"
 *       404:
 *         description: User does not exist or no onboarding data found
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
 *                   example: "No onboarding data found for this user"
 *       500:
 *         description: Failed to retrieve onboarding data
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
 *                   example: "Failed to retrieve onboarding data"
 */
router.get('/onboarding', authenticateToken, actionController.getOnboardingData);

/**
 * @swagger
 * /api/onboarding:
 *   post:
 *     summary: Save onboarding data
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID (UUID or string).
 *                 example: "user-123-abc"
 *               answers:
 *                 type: array
 *                 description: Array of answers to the onboarding questions.
 *                 items:
 *                   type: object
 *                   properties:
 *                     step:
 *                       type: integer
 *                       example: 1
 *                     question:
 *                       type: string
 *                       example: "What is your main health goal?"
 *                     answer:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Improve digestion"]
 *     responses:
 *       200:
 *         description: Onboarding data saved successfully
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
 *                   example: "Onboarding data saved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: integer
 *                       example: 1
 *                     UserId:
 *                       type: string
 *                       example: "user-123-abc"
 *                     Answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                       example: [{"step": 1, "question": "What is your main health goal?", "answer": "Improve digestion"}]
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-07T12:34:56Z"
 *       404:
 *         description: User does not exist
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
 *                   example: "User does not exist"
 *       409:
 *         description: User already has an existing onboarding record
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
 *                   example: "User already has an existing onboarding record"
 *       500:
 *         description: Failed to save onboarding data
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
 *                   example: "Failed to save onboarding data"
 */

router.post('/onboarding', authenticateToken, actionController.saveOnboardingData);

/**
 * @swagger
 * /api/daily-checkin:
 *   post:
 *     summary: Save a daily check-in for a user
 *     tags: [Action]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserId
 *               - Date
 *               - CheckInType
 *               - Questions
 *             properties:
 *               UserId:
 *                 type: string
 *                 format: uuid
 *                 example: "guid-here"
 *               Date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-15"
 *               CheckInType:
 *                 type: string
 *                 example: "Daily"
 *               Questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: "How do you feel today?"
 *                     answer:
 *                       type: string
 *                       example: "Productive and focused"
 *     responses:
 *       200:
 *         description: Daily check-in saved successfully
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
 *                   example: "Daily check-in saved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     CheckInId:
 *                       type: string
 *                       example: "guid-of-checkin"
 *       400:
 *         description: Missing one or more required parameters
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
 *                   example: "Missing one or more required parameters."
 *       404:
 *         description: User does not exist
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
 *                   example: "User does not exist."
 *       500:
 *         description: Failed to save daily check-in
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
 *                   example: "Failed to save daily check-in"
 */
router.post('/daily-checkin', authenticateToken, actionController.saveDailyCheckIn);

/**
 * @swagger
 * /api/daily-checkin/edit:
 *   post:
 *     summary: Edit (overwrite) a daily check-in for the authenticated user for today
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CheckInType
 *               - Questions
 *             properties:
 *               CheckInType:
 *                 type: string
 *                 example: "Daily"
 *               Questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: "How do you feel today?"
 *                     answer:
 *                       type: string
 *                       example: "Productive and focused"
 *     responses:
 *       200:
 *         description: Daily check-in edited successfully
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
 *                   example: "Daily check-in edited successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     CheckInId:
 *                       type: string
 *                       example: "guid-of-checkin"
 *       400:
 *         description: Missing one or more required parameters
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
 *                   example: "Missing one or more required parameters."
 *       404:
 *         description: User does not exist
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
 *                   example: "User does not exist."
 *       500:
 *         description: Failed to edit daily check-in
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
 *                   example: "Failed to edit daily check-in"
 */
router.post('/daily-checkin/edit', authenticateToken, actionController.editDailyCheckIn);

/**
 * @swagger
 * /api/daily-checkin:
 *   get:
 *     summary: Get daily check-in for the authenticated user and date
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date of the check-in (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daily check-in retrieved successfully
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
 *                   example: "Daily check-in retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     CheckInId:
 *                       type: string
 *                     Date:
 *                       type: string
 *                     UserId:
 *                       type: string
 *                     CheckInType:
 *                       type: string
 *                     CreatedAt:
 *                       type: string
 *                     UpdatedAt:
 *                       type: string
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No check-in found for the given user and date
 *       500:
 *         description: Failed to retrieve daily check-in
 */
router.get('/daily-checkin', authenticateToken, actionController.getDailyCheckIn);

/**
 * @swagger
 * /api/recipes/week:
 *   get:
 *     summary: Get all recipes for the authenticated user for a given week, grouped by day
 *     tags: [Recipe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: week
 *         required: true
 *         schema:
 *           type: integer
 *         description: The week number
 *     responses:
 *       200:
 *         description: Recipes grouped by day for the given week
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
 *       400:
 *         description: Missing or invalid week parameter
 *       404:
 *         description: No recipes found for the given week
 *       500:
 *         description: Failed to retrieve recipes
 */
router.get('/recipes/week', authenticateToken, actionController.getUserWeekRecipesGroupedByDay);

/**
 * @swagger
 * /api/shopping-list:
 *   get:
 *     summary: Get the user's shopping list for a specific diet plan template
 *     tags: [Recipe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dietPlanTemplateId
 *         required: false
 *         schema:
 *           type: string
 *         description: The DietPlanTemplateId (UUID). If not provided, uses default.
 *     responses:
 *       200:
 *         description: Shopping list for the given diet plan template
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
 *       400:
 *         description: Invalid DietPlanTemplateId
 *       404:
 *         description: No shopping list found
 *       500:
 *         description: Failed to retrieve shopping list
 */
router.get('/shopping-list', authenticateToken, actionController.getUserShoppingListByDietPlan);

/**
 * @swagger
 * /api/shopping-list/item-status:
 *   put:
 *     summary: Update the checkedOff/onHand status of a shopping list item
 *     tags: [Recipe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shoppingListItemId
 *             properties:
 *               shoppingListItemId:
 *                 type: string
 *                 format: uuid
 *                 description: The ShoppingListItemId (UUID)
 *               checkedOff:
 *                 type: boolean
 *                 description: Checked off status (optional)
 *               onHand:
 *                 type: boolean
 *                 description: On hand status (optional)
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Item not found
 *       500:
 *         description: Failed to update status
 */
router.put('/shopping-list/item-status', authenticateToken, actionController.updateShoppingListItemStatus);

/**
 * @swagger
 * /api/user-preference:
 *   post:
 *     summary: Add a user preference
 *     tags: [UserPreference]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CategoryCode
 *             properties:
 *               CategoryCode:
 *                 type: string
 *                 example: "food"
 *               PreferenceItemId:
 *                 type: integer
 *                 example: 123
 *               FreeTextValue:
 *                 type: string
 *                 example: "custom value"
 *               Source:
 *                 type: string
 *                 example: "user"
 *               Notes:
 *                 type: string
 *                 example: "User entered this manually"
 *     responses:
 *       200:
 *         description: User preference added successfully
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
 *                   example: "User preference added successfully."
 *                 userPreferenceId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
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
 *                   example: "Provide exactly one of PreferenceItemId or FreeTextValue."
 *       500:
 *         description: Failed to add user preference
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
 *                   example: "Failed to add user preference."
 */
router.post('/user-preference', authenticateToken, actionController.addUserPreference);

/**
 * @swagger
 * /api/user-preference/bulk-upsert:
 *   post:
 *     summary: Bulk upsert user preferences
 *     tags: [UserPreference]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 description: Array of user preference items
 *                 items:
 *                   type: object
 *                   required:
 *                     - CategoryCode
 *                   properties:
 *                     CategoryCode:
 *                       type: string
 *                       example: "food"
 *                     PreferenceItemId:
 *                       type: integer
 *                       example: 123
 *                     FreeTextValue:
 *                       type: string
 *                       example: "custom value"
 *                     Source:
 *                       type: string
 *                       example: "user"
 *                     Notes:
 *                       type: string
 *                       example: "Bulk upserted"
 *     responses:
 *       200:
 *         description: User preferences bulk upserted successfully
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
 *                   example: "User preferences bulk upserted successfully."
 *       400:
 *         description: Validation error
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
 *                   example: "Each item must provide exactly one of PreferenceItemId or FreeTextValue."
 *       500:
 *         description: Failed to bulk upsert user preferences
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
 *                   example: "Failed to bulk upsert user preferences."
 */
router.post('/user-preference/bulk-upsert', authenticateToken, actionController.bulkUpsertUserPreferences);

/**
 * @swagger
 * /api/user-preference:
 *   get:
 *     summary: Get all user preferences for the authenticated user
 *     tags: [UserPreference]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
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
 *                   example: "User preferences retrieved successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Validation error
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
 *                   example: "UserId is required."
 *       500:
 *         description: Failed to retrieve user preferences
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
 *                   example: "Failed to retrieve user preferences."
 */
router.get('/user-preference', authenticateToken, actionController.getUserPreferences);

/**
 * @swagger
 * /api/user-action-plans:
 *   get:
 *     summary: Get user action plans with goals by date
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: TargetDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-15"
 *         description: The target date to get action plans for (defaults to today if not provided)
 *     responses:
 *       200:
 *         description: User action plans with goals retrieved successfully
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
 *                   example: "User action plans with goals retrieved successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ActionPlanId:
 *                         type: string
 *                         format: uuid
 *                         description: The unique identifier of the action plan
 *                       UserId:
 *                         type: string
 *                         format: uuid
 *                         description: The unique identifier of the user
 *                       DailyChallengeId:
 *                         type: string
 *                         format: uuid
 *                         description: The unique identifier of the daily challenge
 *                       StartDate:
 *                         type: string
 *                         format: date
 *                         description: The start date of the action plan
 *                       EndDate:
 *                         type: string
 *                         format: date
 *                         description: The end date of the action plan
 *                       AssignedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the action plan was assigned
 *                       ActionPlanCompleted:
 *                         type: boolean
 *                         description: Whether the action plan is completed
 *                       ActionPlanCompletedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the action plan was completed
 *                       ChallengeTitle:
 *                         type: string
 *                         description: The title of the daily challenge
 *                       ChallengeDescription:
 *                         type: string
 *                         description: The description of the daily challenge
 *                       ChallengeWhyItMatters:
 *                         type: string
 *                         description: Why the challenge matters
 *                       ChallengeCreatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the challenge was created
 *                       ChallengeUpdatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the challenge was last updated
 *                       Goals:
 *                         type: array
 *                         description: Array of goals associated with this action plan
 *                         items:
 *                           type: object
 *                           properties:
 *                             ActionPlanGoalId:
 *                               type: string
 *                               format: uuid
 *                               description: The unique identifier of the action plan goal
 *                             GoalId:
 *                               type: string
 *                               format: uuid
 *                               description: The unique identifier of the goal
 *                             GoalTitle:
 *                               type: string
 *                               description: The title of the goal
 *                             GoalDescription:
 *                               type: string
 *                               description: The description of the goal
 *                             Category:
 *                               type: string
 *                               description: The category of the goal
 *                             Instructions:
 *                               type: string
 *                               description: Instructions for the goal
 *                             Benefits:
 *                               type: string
 *                               description: Benefits of completing the goal
 *                             Frequency:
 *                               type: string
 *                               description: How often the goal should be done
 *                             VideoContentTitle:
 *                               type: string
 *                               description: Title of associated video content
 *                             VideoContentLnk:
 *                               type: string
 *                               description: Link to associated video content
 *                             GoalCompleted:
 *                               type: boolean
 *                               description: Whether the goal is completed
 *                             GoalCompletedAt:
 *                               type: string
 *                               format: date-time
 *                               description: When the goal was completed
 *                             GoalAssignedAt:
 *                               type: string
 *                               format: date-time
 *                               description: When the goal was assigned
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *                   example: "Access denied. No token provided."
 *       404:
 *         description: User not found
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
 *                   example: "User not found"
 *       500:
 *         description: Server error
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
 *                   example: "Failed to fetch user action plans with goals."
 */
router.get('/user-action-plans', authenticateToken, actionController.getUserActionPlansWithGoalsByDate);

/**
 * @swagger
 * /api/user-recipes/week:
 *   get:
 *     summary: Get user recipes by week with plan details
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: currentDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-15"
 *         description: The specific date to check for recipes (defaults to today if not provided)
 *       - in: query
 *         name: weekNumber
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 2
 *         description: The week number within the current month (1-5, defaults to calculated week if not provided)
 *     responses:
 *       200:
 *         description: User recipes by week retrieved successfully
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
 *                   example: "User recipes by week retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     MemberDietPlanId:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                       description: The unique identifier of the member's diet plan
 *                     TemplateId:
 *                       type: string
 *                       format: uuid
 *                       example: "987fcdeb-51a2-43d1-b789-123456789abc"
 *                       description: The unique identifier of the diet plan template
 *                     TemplateName:
 *                       type: string
 *                       example: "Keto Diet Plan"
 *                       description: The name of the diet plan template
 *                     WeekNumber:
 *                       type: integer
 *                       example: 2
 *                       description: The week number within the current month (1-5)
 *                     WeekStartDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-14"
 *                       description: The start date of the week within the month
 *                     WeekEndDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-20"
 *                       description: The end date of the week within the month
 *                     PlanStartDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-01"
 *                       description: The start date of the user's diet plan
 *                     PlanEndDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-01-31"
 *                       description: The end date of the user's diet plan
 *                     TotalWeeksInMonth:
 *                       type: integer
 *                       example: 5
 *                       description: Total number of weeks in the current month
 *                     PlanTotalWeeks:
 *                       type: integer
 *                       example: 4
 *                       description: Total number of weeks in the diet plan
 *                     CurrentMonth:
 *                       type: string
 *                       example: "January"
 *                       description: The name of the current month
 *                     CurrentYear:
 *                       type: integer
 *                       example: 2024
 *                       description: The current year
 *                     Days:
 *                       type: array
 *                       description: Array of recipes organized by day and meal
 *                       items:
 *                         type: object
 *                         properties:
 *                           PlanDate:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-15"
 *                             description: The date of the meal
 *                           DayName:
 *                             type: string
 *                             example: "Monday"
 *                             description: The name of the day
 *                           DayOfWeek:
 *                             type: integer
 *                             example: 2
 *                             description: The day number (1=Sunday, 2=Monday, etc.)
 *                           TemplateWeek:
 *                             type: integer
 *                             example: 1
 *                             description: The week number in the diet plan template
 *                           TemplateDayOfWeek:
 *                             type: integer
 *                             example: 2
 *                             description: The day of week in the diet plan template
 *                           MealType:
 *                             type: string
 *                             example: "Breakfast"
 *                             description: The type of meal (Breakfast, Lunch, Dinner, etc.)
 *                           RecipeId:
 *                             type: string
 *                             format: uuid
 *                             example: "456e7890-e89b-12d3-a456-426614174000"
 *                             description: The unique identifier of the recipe
 *                           Title:
 *                             type: string
 *                             example: "Avocado Toast"
 *                             description: The title of the recipe
 *                           Description:
 *                             type: string
 *                             example: "Healthy avocado toast with whole grain bread"
 *                             description: The description of the recipe
 *                           estimatedPrepTime:
 *                             type: integer
 *                             example: 10
 *                             description: Estimated preparation time in minutes
 *                           estimatedCookTime:
 *                             type: integer
 *                             example: 5
 *                             description: Estimated cooking time in minutes
 *                           imageUrl:
 *                             type: string
 *                             example: "https://example.com/avocado-toast.jpg"
 *                             description: URL of the recipe image
 *                           educationalNote:
 *                             type: string
 *                             example: "Avocados are rich in healthy fats and fiber"
 *                             description: Educational information about the recipe
 *                           loggable:
 *                             type: boolean
 *                             example: true
 *                             description: Whether the recipe can be logged
 *                           source:
 *                             type: string
 *                             example: "Emma Health"
 *                             description: The source of the recipe
 *                           Ingredients:
 *                             type: array
 *                             description: Array of ingredients for the recipe
 *                             items:
 *                               type: object
 *                               properties:
 *                                 Name:
 *                                   type: string
 *                                   example: "Avocado"
 *                                 Amount:
 *                                   type: string
 *                                   example: "1"
 *                                 Unit:
 *                                   type: string
 *                                   example: "medium"
 *                                 Notes:
 *                                   type: string
 *                                   example: "ripe"
 *                           Instructions:
 *                             type: array
 *                             description: Array of cooking instructions
 *                             items:
 *                               type: object
 *                               properties:
 *                                 StepOrder:
 *                                   type: integer
 *                                   example: 1
 *                                 Instruction:
 *                                   type: string
 *                                   example: "Toast the bread until golden brown"
 *                           Swaps:
 *                             type: array
 *                             description: Array of ingredient swap options
 *                             items:
 *                               type: object
 *                               properties:
 *                                 OriginalIngredient:
 *                                   type: string
 *                                   example: "Bread"
 *                                 SwapIngredient:
 *                                   type: string
 *                                   example: "Gluten-free bread"
 *                                 Notes:
 *                                   type: string
 *                                   example: "For gluten-free option"
 *                           Tags:
 *                             type: array
 *                             description: Array of recipe tags
 *                             items:
 *                               type: object
 *                               properties:
 *                                 Tag:
 *                                   type: string
 *                                   example: "Healthy"
 *       400:
 *         description: Validation error
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
 *                   examples:
 *                     missingUserId:
 *                       value: "UserId is required."
 *                     invalidDate:
 *                       value: "CurrentDate must be in YYYY-MM-DD format."
 *                     invalidWeekNumber:
 *                       value: "WeekNumber must be a positive integer."
 *       404:
 *         description: No recipes found or no active diet plan
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
 *                   examples:
 *                     noRecipes:
 *                       value: "No recipes found for the given week."
 *                     noActivePlan:
 *                       value: "No active diet plan found for the user."
 *       500:
 *         description: Server error
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
 *                   example: "Failed to retrieve user recipes by week."
 */
router.get('/user-recipes/week', authenticateToken, actionController.getUserRecipesByWeek);

/**
 * @swagger
 * /api/shopping-list/current-week:
 *   get:
 *     summary: Get user shopping list for current week based on specific diet plan
 *     tags: [Action]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retrieves the shopping list for the authenticated user's current week based on a specific diet plan.
 *       The API calculates the week based on calendar months and aggregates ingredients from all recipes
 *       scheduled for that week in the specified diet plan. You can specify a specific date and week number
 *       to get shopping lists for different weeks.
 *     parameters:
 *       - in: query
 *         name: dietPlanTemplateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the diet plan template
 *         example: "D2EBE5DD-CEB2-4264-B540-0FA37190263F"
 *       - in: query
 *         name: currentDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-15"
 *         description: The specific date to check for shopping list (defaults to today if not provided)
 *       - in: query
 *         name: weekNumber
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 2
 *         description: The week number within the current month (1-5, defaults to calculated week if not provided)
 *     responses:
 *       200:
 *         description: Shopping list retrieved successfully
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
 *                   example: "Shopping list retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     shoppingList:
 *                       type: array
 *                       description: Array of shopping list items
 *                       items:
 *                         type: object
 *                         properties:
 *                           ShoppingListItemId:
 *                             type: string
 *                             format: uuid
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                             description: The unique identifier of the shopping list item
 *                           Category:
 *                             type: string
 *                             example: "Produce"
 *                             description: The ingredient category name
 *                           ingredientName:
 *                             type: string
 *                             example: "Avocado"
 *                             description: The name of the ingredient
 *                           amount:
 *                             type: number
 *                             example: 2.5
 *                             description: The amount of the ingredient needed (aggregated from multiple recipes)
 *                           Unit:
 *                             type: string
 *                             example: "medium"
 *                             description: The unit of measurement for the ingredient
 *                           notes:
 *                             type: string
 *                             example: "ripe"
 *                             description: Additional notes about the ingredient
 *                           onHand:
 *                             type: boolean
 *                             example: false
 *                             description: Whether the ingredient is already on hand
 *                           checkedOff:
 *                             type: boolean
 *                             example: false
 *                             description: Whether the ingredient has been checked off the shopping list
 *                           PurchasedOn:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-15"
 *                             description: The date when the ingredient was purchased (empty string if not purchased)
 *       400:
 *         description: Validation error
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
 *                   examples:
 *                     missingUserId:
 *                       value: "UserId is required."
 *                     missingTemplateId:
 *                       value: "DietPlanTemplateId is required."
 *                     invalidDate:
 *                       value: "CurrentDate must be in YYYY-MM-DD format."
 *                     invalidWeekNumber:
 *                       value: "WeekNumber must be a positive integer."
 *       404:
 *         description: No shopping list found for the specified diet plan
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
 *                   example: "No shopping list found for the specified diet plan."
 *       500:
 *         description: Server error
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
 *                   example: "Failed to retrieve shopping list."
 */
router.get('/shopping-list/current-week', authenticateToken, actionController.getUserShoppingListByDietPlanCurrentWeek);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist (recipes)
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
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
 *                       WishlistId:
 *                         type: integer
 *                       RecipeId:
 *                         type: string
 *                       RecipeName:
 *                         type: string
 *                       RecipeDescription:
 *                         type: string
 *                       MealType:
 *                         type: string
 *                       EstimatedPrepTime:
 *                         type: integer
 *                       EstimatedCookTime:
 *                         type: integer
 *                       ImageUrl:
 *                         type: string
 *                       AddedToWishlistDate:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: UserId is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to retrieve wishlist
 */
router.get('/wishlist', authenticateToken, actionController.getUserWishlist);

/**
 * @swagger
 * /api/wishlist/toggle:
 *   post:
 *     summary: Add or remove a recipe from user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - RecipeId
 *               - IsWishlisted
 *             properties:
 *               RecipeId:
 *                 type: string
 *                 description: The RecipeId (UUID)
 *               IsWishlisted:
 *                 type: boolean
 *                 description: true to add, false to remove
 *     responses:
 *       200:
 *         description: Wishlist updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "Success"
 *       400:
 *         description: Missing or invalid parameters
 *       404:
 *         description: User or recipe not found
 *       500:
 *         description: Failed to update wishlist
 */
router.post('/wishlist/toggle', authenticateToken, actionController.toggleWishlistItem);

module.exports = router;
