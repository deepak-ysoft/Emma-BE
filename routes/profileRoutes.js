const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const authenticateToken = require("../middleware/authenticate");

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get profile data for the authenticated user (user details and onboarding)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
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
 *                   example: "Profile data retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     UserId:
 *                       type: string
 *                       example: "user-guid"
 *                     FullName:
 *                       type: string
 *                       example: "John Doe"
 *                     Email:
 *                       type: string
 *                       example: "john@example.com"
 *                     UserName:
 *                       type: string
 *                       example: "johnny"
 *                     DateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1990-01-01"
 *                     PhoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     State:
 *                       type: string
 *                       example: "CA"
 *                     City:
 *                       type: string
 *                       example: "San Francisco"
 *                     ZipCode:
 *                       type: string
 *                       example: "94105"
 *                     onboarding:
 *                       type: object
 *                       properties:
 *                         Id:
 *                           type: integer
 *                           example: 1
 *                         UserId:
 *                           type: string
 *                           example: "user-guid"
 *                         Answers:
 *                           type: object
 *                           example: {"question1": "answer1"}
 *                         CreatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-03-14T12:34:56Z"
 *       404:
 *         description: No profile data found for this user
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
 *                   example: "No profile data found for this user"
 *       500:
 *         description: Failed to retrieve profile data
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
 *                   example: "Failed to retrieve profile data"
 */
router.get("/", authenticateToken, profileController.getProfile);

/**
 * @swagger
 * /api/profile/personal-info:
 *   put:
 *     summary: Update personal information for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FullName
 *               - DateOfBirth
 *               - Gender
 *               - Ethnicity
 *               - Race
 *             properties:
 *               FullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               DateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1992-04-15"
 *               Gender:
 *                 type: string
 *                 example: "female"
 *               Ethnicity:
 *                 type: string
 *                 example: "asian"
 *               Race:
 *                 type: string
 *                 example: "indian"
 *     responses:
 *       200:
 *         description: Personal information updated successfully
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
 *                   example: "Personal information updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       example: "user-guid"
 *                     FullName:
 *                       type: string
 *                       example: "Jane Doe"
 *                     DateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1992-04-15"
 *                     Gender:
 *                       type: string
 *                       example: "female"
 *                     Ethnicity:
 *                       type: string
 *                       example: "asian"
 *                     Race:
 *                       type: string
 *                       example: "indian"
 *       400:
 *         description: All personal information fields are required
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
 *                   example: "All personal information fields are required."
 *       404:
 *         description: User not found or not updated
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
 *                   example: "User not found or not updated."
 *       500:
 *         description: Failed to update personal information
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
 *                   example: "Failed to update personal information"
 */
router.put(
  "/personal-info",
  authenticateToken,
  profileController.updatePersonalInfo
);

/**
 * @swagger
 * /api/profile/contact-location:
 *   put:
 *     summary: Update contact and location information for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *               - PhoneNumber
 *               - StreetAddress
 *               - City
 *               - State
 *               - ZipCode
 *             properties:
 *               Email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               PhoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *               StreetAddress:
 *                 type: string
 *                 example: "123 Main St"
 *               City:
 *                 type: string
 *                 example: "San Francisco"
 *               State:
 *                 type: string
 *                 example: "CA"
 *               ZipCode:
 *                 type: string
 *                 example: "94105"
 *               Country:
 *                 type: string
 *                 example: "USA"
 *     responses:
 *       200:
 *         description: Contact and location information updated successfully
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
 *                   example: "Contact and location information updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       example: "user-guid"
 *                     Email:
 *                       type: string
 *                       example: "jane.doe@example.com"
 *                     PhoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     StreetAddress:
 *                       type: string
 *                       example: "123 Main St"
 *                     City:
 *                       type: string
 *                       example: "San Francisco"
 *                     State:
 *                       type: string
 *                       example: "CA"
 *                     ZipCode:
 *                       type: string
 *                       example: "94105"
 *                     Country:
 *                       type: string
 *                       example: "USA"
 *       400:
 *         description: All contact and location fields are required
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
 *                   example: "All contact and location fields are required."
 *       409:
 *         description: Email address is already in use by another account
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
 *                   example: "Email address is already in use by another account."
 *       404:
 *         description: User not found or not updated
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
 *                   example: "User not found or not updated."
 *       500:
 *         description: Failed to update contact and location information
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
 *                   example: "Failed to update contact and location information"
 */
router.put(
  "/contact-location",
  authenticateToken,
  profileController.updateUserContactLocation
);

/**
 * @swagger
 * /api/profile/health-background:
 *   put:
 *     summary: Update health background for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               allergies:
 *                 type: object
 *                 properties:
 *                   hasAllergies:
 *                     type: boolean
 *                     example: true
 *                   allergyDetails:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "allergy_1748486114209"
 *                         name:
 *                           type: string
 *                           example: "Peanuts"
 *                         reactionType:
 *                           type: string
 *                           example: "Anaphylaxis"
 *                         lastOccurrence:
 *                           type: string
 *                           format: date
 *                           example: "2025-05-15"
 *               medications:
 *                 type: object
 *                 properties:
 *                   takesMedications:
 *                     type: boolean
 *                     example: true
 *                   medicationDetails:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "medication_1748486125636"
 *                         name:
 *                           type: string
 *                           example: "Ibuprofen"
 *                         doseFrequency:
 *                           type: string
 *                           example: "200mg twice daily"
 *                         reasonForUse:
 *                           type: string
 *                           example: "Headache"
 *               personalMedicalHistory:
 *                 type: object
 *                 properties:
 *                   alcoholism_drug_abuse:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   asthma:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Past"
 *                   arthritis_bone_disease:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Past"
 *                   blood_disorders:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   cancer:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Past"
 *                   chronic_pain:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   depression_anxiety:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   diabetes:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Past"
 *                   copd:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   gastrointestinal:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   heart_disease:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   high_blood_pressure:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   high_cholesterol:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   hypothyroidism:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   immune_disorders:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   liver_disease:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Past"
 *                   migraine_headaches:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   sleep_apnea:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Past"
 *                   skin_disorders:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   renal_disease:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   other_medical_history:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *               gastrointestinalHistory:
 *                 type: object
 *                 properties:
 *                   acid_reflux:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   colitis:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   constipation:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   diarrhea:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   flatulence:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   gas_pain:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Current"
 *                   hemorrhoids:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   ibs:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Never"
 *                   abdominal_pain:
 *                     type: string
 *                     enum: [Current, Past, Never]
 *                     example: "Past"
 *     responses:
 *       200:
 *         description: Health background updated successfully
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
 *                   example: "Health background updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     allergies:
 *                       type: object
 *                       properties:
 *                         hasAllergies:
 *                           type: boolean
 *                           example: true
 *                         allergyDetails:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "allergy_1748486114209"
 *                               name:
 *                                 type: string
 *                                 example: "Peanuts"
 *                               reactionType:
 *                                 type: string
 *                                 example: "Anaphylaxis"
 *                               lastOccurrence:
 *                                 type: string
 *                                 format: date
 *                                 example: "2025-05-15"
 *                     medications:
 *                       type: object
 *                       properties:
 *                         takesMedications:
 *                           type: boolean
 *                           example: true
 *                         medicationDetails:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "medication_1748486125636"
 *                               name:
 *                                 type: string
 *                                 example: "Ibuprofen"
 *                               doseFrequency:
 *                                 type: string
 *                                 example: "200mg twice daily"
 *                               reasonForUse:
 *                                 type: string
 *                                 example: "Headache"
 *                     personalMedicalHistory:
 *                       type: object
 *                       properties:
 *                         alcoholism_drug_abuse:
 *                           type: string
 *                           example: "Current"
 *                         asthma:
 *                           type: string
 *                           example: "Past"
 *                         # ... (all other personal medical history fields)
 *                     gastrointestinalHistory:
 *                       type: object
 *                       properties:
 *                         acid_reflux:
 *                           type: string
 *                           example: "Current"
 *                         # ... (all other GI history fields)
 *       400:
 *         description: User ID is required
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
 *                   example: "User ID is required."
 *       500:
 *         description: Failed to update health background
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
 *                   example: "Failed to update health background"
 */
router.put(
  "/health-background",
  authenticateToken,
  profileController.updateHealthBackground
);

/**
 * @swagger
 * /api/profile/health-background:
 *   get:
 *     summary: Get health background for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Health background fetched successfully
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
 *                   example: "Health background fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     allergies:
 *                       type: object
 *                       properties:
 *                         hasAllergies:
 *                           type: boolean
 *                           example: true
 *                         allergyDetails:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "851B400D-8E41-4891-9CAF-DEAAE44B84BB"
 *                               name:
 *                                 type: string
 *                                 example: "Peanuts"
 *                               reactionType:
 *                                 type: string
 *                                 example: "Anaphylaxis"
 *                               lastOccurrence:
 *                                 type: string
 *                                 format: date
 *                                 example: "2025-05-15"
 *                     medications:
 *                       type: object
 *                       properties:
 *                         takesMedications:
 *                           type: boolean
 *                           example: true
 *                         medicationDetails:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "08DD9C7A-E9D3-432A-B1C4-A0AB9F0E3FDE"
 *                               name:
 *                                 type: string
 *                                 example: "Ibuprofen"
 *                               doseFrequency:
 *                                 type: string
 *                                 example: "200mg twice daily"
 *                               reasonForUse:
 *                                 type: string
 *                                 example: "Headache"
 *                     personalMedicalHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                             example: "high_blood_pressure"
 *                           value:
 *                             type: string
 *                             example: "Current"
 *                     gastrointestinalHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                             example: "gas_pain"
 *                           value:
 *                             type: string
 *                             example: "Current"
 *       404:
 *         description: User health background not found
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
 *                   example: "User health background not found."
 *       500:
 *         description: Failed to fetch health background
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
 *                   example: "Failed to fetch health background"
 */
router.get(
  "/health-background",
  authenticateToken,
  profileController.getHealthBackground
);

/**
 * @swagger
 * /api/profile/mental-health:
 *   put:
 *     summary: Upsert mental health record for the authenticated user (for today)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               depression:
 *                 type: object
 *                 required:
 *                   - interest
 *                   - feelingDown
 *                   - sleep
 *                   - energy
 *                   - appetite
 *                   - selfWorth
 *                   - concentration
 *                   - movement
 *                   - thoughts
 *                 properties:
 *                   interest:
 *                     type: integer
 *                     example: 2
 *                   feelingDown:
 *                     type: integer
 *                     example: 1
 *                   sleep:
 *                     type: integer
 *                     example: 3
 *                   energy:
 *                     type: integer
 *                     example: 0
 *                   appetite:
 *                     type: integer
 *                     example: 0
 *                   selfWorth:
 *                     type: integer
 *                     example: 0
 *                   concentration:
 *                     type: integer
 *                     example: 3
 *                   movement:
 *                     type: integer
 *                     example: 0
 *                   thoughts:
 *                     type: integer
 *                     example: 1
 *               stressAnxiety:
 *                 type: object
 *                 required:
 *                   - nervous
 *                   - worryControl
 *                   - worryTooMuch
 *                   - relax
 *                   - restless
 *                   - irritable
 *                   - afraid
 *                 properties:
 *                   nervous:
 *                     type: integer
 *                     example: 1
 *                   worryControl:
 *                     type: integer
 *                     example: 2
 *                   worryTooMuch:
 *                     type: integer
 *                     example: 3
 *                   relax:
 *                     type: integer
 *                     example: 1
 *                   restless:
 *                     type: integer
 *                     example: 0
 *                   irritable:
 *                     type: integer
 *                     example: 3
 *                   afraid:
 *                     type: integer
 *                     example: 1
 *     responses:
 *       200:
 *         description: Mental health record updated successfully
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
 *                   example: "Mental health record updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     recordId:
 *                       type: string
 *                       example: "A1B2C3D4-E5F6-7890-1234-56789ABCDEF0"
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
 *                   example: "Payload must include depression and stressAnxiety objects."
 *       500:
 *         description: Failed to update mental health record
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
 *                   example: "Failed to update mental health record"
 */
router.put(
  "/mental-health",
  authenticateToken,
  profileController.upsertUserMentalHealth
);

/**
 * @swagger
 * /api/profile/mental-health:
 *   get:
 *     summary: Get user's latest mental health record (no date filter, only one per user)
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mental health record fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Status:
 *                   type: string
 *                   example: "Success"
 *                 Message:
 *                   type: string
 *                   example: "Mental health record fetched successfully"
 *                 MentalHealthData:
 *                   type: object
 *                   properties:
 *                     depression:
 *                       type: object
 *                       properties:
 *                         interest: { type: integer, example: 2 }
 *                         feelingDown: { type: integer, example: 1 }
 *                         sleep: { type: integer, example: 3 }
 *                         energy: { type: integer, example: 0 }
 *                         appetite: { type: integer, example: 0 }
 *                         selfWorth: { type: integer, example: 0 }
 *                         concentration: { type: integer, example: 3 }
 *                         movement: { type: integer, example: 0 }
 *                         thoughts: { type: integer, example: 1 }
 *                     stressAnxiety:
 *                       type: object
 *                       properties:
 *                         nervous: { type: integer, example: 1 }
 *                         worryControl: { type: integer, example: 2 }
 *                         worryTooMuch: { type: integer, example: 3 }
 *                         relax: { type: integer, example: 1 }
 *                         restless: { type: integer, example: 0 }
 *                         irritable: { type: integer, example: 3 }
 *                         afraid: { type: integer, example: 1 }
 *       404:
 *         description: Mental health record not found
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
 *                   example: "Mental health record not found."
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
 *                   example: "Validation error"
 *       500:
 *         description: Failed to fetch mental health record
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
 *                   example: "Failed to fetch mental health record"
 */
router.get(
  "/mental-health",
  authenticateToken,
  profileController.getUserMentalHealth
);

/**
 * @swagger
 * /api/profile/health-assessment:
 *   get:
 *     summary: Get the latest health assessment for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Health assessment fetched successfully
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
 *                   example: "Health assessment fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     generalHealth:
 *                       type: object
 *                       properties:
 *                         health: { type: string, example: "Good" }
 *                     physicalHealth:
 *                       type: object
 *                       properties:
 *                         ModerateActivities: { type: string, example: "No problem" }
 *                         ClimbingStairs: { type: string, example: "Some problem" }
 *                     rolePhysical:
 *                       type: object
 *                       properties:
 *                         accomplishLess: { type: boolean, example: false }
 *                         limited: { type: boolean, example: true }
 *                     pain:
 *                       type: object
 *                       properties:
 *                         level: { type: integer, example: 3 }
 *                     mentalHealth:
 *                       type: object
 *                       properties:
 *                         Calm: { type: integer, example: 2 }
 *                         Energy: { type: integer, example: 3 }
 *                         Downhearted: { type: integer, example: 1 }
 *                     socialFunctioning:
 *                       type: object
 *                       properties:
 *                         Interference: { type: integer, example: 0 }
 *                     roleEmotional:
 *                       type: object
 *                       properties:
 *                         accomplishLess: { type: boolean, example: false }
 *                         limited: { type: boolean, example: false }
 *                     swls:
 *                       type: object
 *                       properties:
 *                         IdealLife: { type: integer, example: 4 }
 *                         Conditions: { type: integer, example: 3 }
 *                         Satisfied: { type: integer, example: 5 }
 *                         ImportantThings: { type: integer, example: 4 }
 *                         ChangeNothing: { type: integer, example: 2 }
 *                     familyHistoryDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           ConditionName: { type: string, example: "Diabetes" }
 *                           relatives: { type: string, example: "Father, Mother" }
 *                     familyHistoryMeta:
 *                       type: object
 *                       properties:
 *                         ParentsAlive: { type: boolean, example: true }
 *                         ParentsDeathCause: { type: string, example: "" }
 *       404:
 *         description: No health assessment record found
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
 *                   example: "No health assessment record found."
 *       500:
 *         description: Failed to fetch health assessment
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
 *                   example: "Failed to fetch health assessment"
 */
router.get(
  "/health-assessment",
  authenticateToken,
  profileController.getHealthAssessmentByUserId
);

/**
 * @swagger
 * /api/profile/health-assessment:
 *   post:
 *     summary: Insert or update a health assessment for the authenticated user
 *     description: |
 *       This endpoint creates or updates a comprehensive health assessment including:
 *       - General health status
 *       - Physical and mental health metrics
 *       - Pain levels
 *       - Social functioning
 *       - Emotional role limitations
 *       - Life satisfaction
 *       - Family medical history
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               generalHealth:
 *                 type: object
 *                 properties:
 *                   health:
 *                     type: string
 *                     enum: [Excellent, Very Good, Good, Fair, Poor]
 *                     example: "Good"
 *                     description: Self-reported general health status
 *               physicalHealth:
 *                 type: object
 *                 properties:
 *                   moderateActivities:
 *                     type: string
 *                     enum: [No, not limited at all, Yes, limited a little, Yes, limited a lot]
 *                     example: "No, not limited at all"
 *                     description: Ability to do moderate activities
 *                   climbingStairs:
 *                     type: string
 *                     enum: [No, not limited at all, Yes, limited a little, Yes, limited a lot]
 *                     example: "Yes, limited a lot"
 *                     description: Ability to climb stairs
 *               rolePhysical:
 *                 type: object
 *                 properties:
 *                   accomplishLess:
 *                     type: boolean
 *                     example: true
 *                     description: Accomplished less due to physical health
 *                   limited:
 *                     type: boolean
 *                     example: true
 *                     description: Limited in kind of work due to physical health
 *               pain:
 *                 type: object
 *                 properties:
 *                   level:
 *                     type: string
 *                     enum: [None, Very Mild, Mild, Moderate, Severe, Very Severe, Worst Possible]
 *                     example: "Very Mild"
 *                     description: Pain level intensity
 *               mentalHealth:
 *                 type: object
 *                 properties:
 *                   calm:
 *                     type: string
 *                     enum: [All of the time, Most of the time, A good bit of the time, Some of the time, A little of the time, None of the time]
 *                     example: "A little of the time"
 *                     description: Frequency of feeling calm
 *                   energy:
 *                     type: string
 *                     enum: [All of the time, Most of the time, A good bit of the time, Some of the time, A little of the time, None of the time]
 *                     example: "A little of the time"
 *                     description: Frequency of having energy
 *                   downhearted:
 *                     type: string
 *                     enum: [All of the time, Most of the time, A good bit of the time, Some of the time, A little of the time, None of the time]
 *                     example: "Most of the time"
 *                     description: Frequency of feeling downhearted
 *               socialFunctioning:
 *                 type: object
 *                 properties:
 *                   interference:
 *                     type: string
 *                     enum: [All of the time, Most of the time, A good bit of the time, Some of the time, A little of the time, None of the time]
 *                     example: "Most of the time"
 *                     description: Extent health interferes with social activities
 *               roleEmotional:
 *                 type: object
 *                 properties:
 *                   accomplishLess:
 *                     type: boolean
 *                     example: true
 *                     description: Accomplished less due to emotional problems
 *                   limited:
 *                     type: boolean
 *                     example: true
 *                     description: Limited in kind of work due to emotional problems
 *               swls:
 *                 type: object
 *                 properties:
 *                   idealLife:
 *                     type: string
 *                     enum: [Strongly Disagree, Disagree, Slightly Disagree, Neither Agree nor Disagree, Slightly Agree, Agree, Strongly Agree]
 *                     example: "Agree"
 *                     description: Satisfaction with ideal life
 *                   conditions:
 *                     type: string
 *                     enum: [Strongly Disagree, Disagree, Slightly Disagree, Neither Agree nor Disagree, Slightly Agree, Agree, Strongly Agree]
 *                     example: "Slightly Disagree"
 *                     description: Satisfaction with living conditions
 *                   satisfied:
 *                     type: string
 *                     enum: [Strongly Disagree, Disagree, Slightly Disagree, Neither Agree nor Disagree, Slightly Agree, Agree, Strongly Agree]
 *                     example: "Disagree"
 *                     description: General life satisfaction
 *                   importantThings:
 *                     type: string
 *                     enum: [Strongly Disagree, Disagree, Slightly Disagree, Neither Agree nor Disagree, Slightly Agree, Agree, Strongly Agree]
 *                     example: "Slightly Disagree"
 *                     description: Satisfaction with important aspects of life
 *                   changeNothing:
 *                     type: string
 *                     enum: [Strongly Disagree, Disagree, Slightly Disagree, Neither Agree nor Disagree, Slightly Agree, Agree, Strongly Agree]
 *                     example: "Neither Agree nor Disagree"
 *                     description: Desire to change life circumstances
 *               familyHistory:
 *                 type: object
 *                 properties:
 *                   parentsAlive:
 *                     type: boolean
 *                     example: false
 *                     description: Whether both parents are alive
 *                   parentsDeathCause:
 *                     type: string
 *                     example: "asthma"
 *                     description: Cause of parents' death if applicable
 *                   heartDisease:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Brother", "Sister"]
 *                     description: Relatives with heart disease history
 *                   cancer:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Maternal Grandmother", "Brother", "Mother"]
 *                     description: Relatives with cancer history
 *                   diabetes:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Brother"]
 *                     description: Relatives with diabetes history
 *                   lungDisease:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Brother"]
 *                     description: Relatives with lung disease history
 *                   bloodDisorders:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Mother"]
 *                     description: Relatives with blood disorders history
 *                   autoImmune:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Brother", "Sister"]
 *                     description: Relatives with autoimmune disease history
 *                   highBloodPressure:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Paternal Grandmother", "Paternal Grandfather"]
 *                     description: Relatives with high blood pressure history
 *                   highCholesterol:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Maternal Grandfather"]
 *                     description: Relatives with high cholesterol history
 *                   thyroid:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Brother"]
 *                     description: Relatives with thyroid conditions history
 *                   mentalHealth:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Mother"]
 *                     description: Relatives with mental health conditions history
 *                   giConditions:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Maternal Grandmother"]
 *                     description: Relatives with gastrointestinal conditions history
 *                   liverDisease:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Father"]
 *                     description: Relatives with liver disease history
 *                   skinDisorders:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Brother", "Sister"]
 *                     description: Relatives with skin disorders history
 *                   kidneyDisease:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [Father, Mother, Grandfather, Grandmother, Brother, Sister, Uncle, Aunt, Paternal Grandfather, Paternal Grandmother, Maternal Grandfather, Maternal Grandmother]
 *                     example: ["Mother"]
 *                     description: Relatives with kidney disease history
 *             required:
 *               - generalHealth
 *               - physicalHealth
 *     responses:
 *       200:
 *         description: Health assessment upserted successfully
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
 *                   example: "Health assessment inserted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     assessmentId:
 *                       type: integer
 *                       example: 123
 *       400:
 *         description: Validation error (missing user ID or invalid payload)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.post(
  "/health-assessment",
  authenticateToken,
  profileController.insertHealthAssessment
);

/**
 * @swagger
 * /api/profile/wellness:
 *   put:
 *     summary: Upsert wellness data for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sleep:
 *                 type: object
 *                 properties:
 *                   hours:
 *                     type: integer
 *                     example: 8
 *                   quality:
 *                     type: string
 *                     example: "Not at all rested"
 *                   takesSleepAids:
 *                     type: boolean
 *                     example: true
 *                   hasSleepDisorder:
 *                     type: boolean
 *                     example: true
 *               meditation:
 *                 type: object
 *                 properties:
 *                   practices:
 *                     type: boolean
 *                     example: true
 *                   frequency:
 *                     type: string
 *                     example: "Daily"
 *               diet:
 *                 type: object
 *                 properties:
 *                   followsSpecialDiet:
 *                     type: boolean
 *                     example: true
 *                   dietDescription:
 *                     type: string
 *                     example: "ads"
 *                   supplements:
 *                     type: string
 *                     example: "adsa"
 *               exercise:
 *                 type: object
 *                 properties:
 *                   exercises:
 *                     type: boolean
 *                     example: true
 *                   details:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "YOga"
 *                       frequency:
 *                         type: string
 *                         example: "Daily"
 *                       duration:
 *                         type: integer
 *                         example: 30
 *               goals:
 *                 type: object
 *                 properties:
 *                   obstacles:
 *                     type: string
 *                     example: "Other"
 *             example:
 *               sleep:
 *                 hours: 8
 *                 quality: "Not at all rested"
 *                 takesSleepAids: true
 *                 hasSleepDisorder: true
 *               meditation:
 *                 practices: true
 *                 frequency: "Daily"
 *               diet:
 *                 followsSpecialDiet: true
 *                 dietDescription: "ads"
 *                 supplements: "adsa"
 *               exercise:
 *                 exercises: true
 *                 details:
 *                   type: "YOga"
 *                   frequency: "Daily"
 *                   duration: 30
 *               goals:
 *                 obstacles: "Other"
 *     responses:
 *       200:
 *         description: Wellness data upserted successfully
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
 *                   example: "Wellness data upserted successfully"
 *       400:
 *         description: Validation error (missing user ID or invalid payload)
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
 *                   example: "User ID is required."
 *       500:
 *         description: Failed to upsert wellness data
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
 *                   example: "Failed to upsert wellness data"
 */
router.put(
  "/wellness",
  authenticateToken,
  profileController.upsertWellnessData
);

/**
 * @swagger
 * /api/profile/wellness:
 *   get:
 *     summary: Get wellness data for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wellness data fetched successfully
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
 *                   example: "Wellness data fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sleep:
 *                       type: object
 *                       properties:
 *                         hours: { type: integer, example: 8 }
 *                         quality: { type: string, example: "Not at all rested" }
 *                         takesSleepAids: { type: boolean, example: true }
 *                         hasSleepDisorder: { type: boolean, example: true }
 *                     meditation:
 *                       type: object
 *                       properties:
 *                         practices: { type: boolean, example: true }
 *                         frequency: { type: string, example: "Daily" }
 *                     diet:
 *                       type: object
 *                       properties:
 *                         followsSpecialDiet: { type: boolean, example: true }
 *                         dietDescription: { type: string, example: "ads" }
 *                         supplements: { type: string, example: "adsa" }
 *                     exercise:
 *                       type: object
 *                       properties:
 *                         exercises: { type: boolean, example: true }
 *                         details:
 *                           type: object
 *                           properties:
 *                             type: { type: string, example: "Yoga" }
 *                             frequency: { type: string, example: "Daily" }
 *                             duration: { type: integer, example: 30 }
 *                     goals:
 *                       type: object
 *                       properties:
 *                         obstacles: { type: string, example: "Other" }
 *       404:
 *         description: Wellness data not found
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
 *                   example: "Wellness data not found."
 *       500:
 *         description: Failed to fetch wellness data
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
 *                   example: "Failed to fetch wellness data"
 */
router.get("/wellness", authenticateToken, profileController.getWellnessData);

/**
 * @swagger
 * /api/profile/progress-status:
 *   get:
 *     summary: Get onboarding progress status for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress status fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Progress status fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     progressPercentage:
 *                       type: integer
 *                       example: 56
 *                     hasCompletedUpTo70Percent:
 *                       type: boolean
 *                       example: false
 *                     completedSections:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["initial", "profileInfo", "contactLocation"]
 *                     currentSection:
 *                       type: string
 *                       example: "lifestyleDiet"
 *       400:
 *         description: User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "User ID is required."
 *                 data:
 *                   type: object
 *                   nullable: true
 *       404:
 *         description: Progress status not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Progress status not found."
 *                 data:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Failed to fetch progress status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch progress status"
 *                 data:
 *                   type: object
 *                   nullable: true
 */
router.get(
  "/progress-status",
  authenticateToken,
  profileController.getUserProgressStatus
);

/**
 * @swagger
 * /api/profile/change-password:
 *   post:
 *     summary: Change password for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword456"
 *               confirmNewPassword:
 *                 type: string
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: "Password changed successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error or passwords do not match
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
 *                   example: "New password and confirmation do not match."
 *       401:
 *         description: Current password is incorrect
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
 *                   example: "Current password is incorrect."
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
 *                   example: "User not found."
 *       500:
 *         description: Failed to change password
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
 *                   example: "Failed to change password."
 */
router.post(
  "/change-password",
  authenticateToken,
  profileController.changeUserPassword
);

/**
 * @swagger
 * /api/profile/delete-account:
 *   delete:
 *     summary: Delete the authenticated user's account and all related data
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account and all related data deleted successfully
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
 *                   example: "User account and all related data deleted successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
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
 *                   example: "User not found."
 *       500:
 *         description: Error deleting user account
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
 *                   example: "Error deleting user account: ..."
 */
router.delete(
  "/delete-account",
  authenticateToken,
  profileController.deleteUserAccountWithCascade
);

/**
 * @swagger
 * /api/profile/basic:
 *   get:
 *     summary: Get basic user profile for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                   example: "User profile retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       format: uuid
 *                     FullName:
 *                       type: string
 *                       example: "John Doe"
 *                     Email:
 *                       type: string
 *                       example: "john@example.com"
 *                     UserName:
 *                       type: string
 *                       example: "johnny"
 *                     PhoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                     UpdatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: User ID is required
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
 *                   example: "User ID is required."
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
 *                   example: "User not found."
 *       500:
 *         description: Failed to retrieve user profile
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
 *                   example: "Failed to retrieve user profile."
 */
router.get("/basic", authenticateToken, profileController.getUserProfileBasic);

/**
 * @swagger
 * /api/profile/basic:
 *   put:
 *     summary: Update basic user profile for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName:
 *                 type: string
 *                 example: "Jane Doe"
 *               Email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               PhoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *                   example: "User profile updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       format: uuid
 *                     FullName:
 *                       type: string
 *                       example: "Jane Doe"
 *                     Email:
 *                       type: string
 *                       example: "jane.doe@example.com"
 *                     UserName:
 *                       type: string
 *                       example: "jane"
 *                     PhoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                     UpdatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: User ID is required
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
 *                   example: "User ID is required."
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
 *                   example: "User not found."
 *       409:
 *         description: Email already in use by another account
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
 *                   example: "Email already in use by another account."
 *       500:
 *         description: Error updating user profile
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
 *                   example: "Error updating user profile: ..."
 */
router.put("/basic", authenticateToken, profileController.updateUserAccount);

/**
 * @swagger
 * /api/profile/contact-us:
 *   post:
 *     summary: Submit a contact us form (optionally authenticated)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - Email
 *               - Subject
 *               - Message
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "Jane Doe"
 *               Email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               Subject:
 *                 type: string
 *                 example: "Feedback about the app"
 *               Message:
 *                 type: string
 *                 example: "I love your app! Keep up the good work."
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
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
 *                   example: "Contact form submitted successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     subject:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error (missing required fields)
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
 *                   example: "Name, Email, Subject, and Message are required."
 *       500:
 *         description: Failed to submit contact form
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
 *                   example: "Failed to submit contact form."
 */
router.post("/contact-us", profileController.createContactUsSubmission);

/**
 * @swagger
 * /api/profile/user-profile-details:
 *   get:
 *     summary: Get user profile details (HealthFocus, MotivationLevel)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User profile details fetched successfully" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id: { type: string, format: uuid }
 *                     UserId: { type: string, format: uuid }
 *                     HealthFocus: { type: string, example: "Weight Loss" }
 *                     MotivationLevel: { type: integer, example: 3 }
 *                     CreatedAt: { type: string, format: date-time }
 *                     UpdatedAt: { type: string, format: date-time }
 *       404:
 *         description: User profile details not found
 *       500:
 *         description: Error fetching user profile details
 */
router.get(
  "/user-profile-details",
  authenticateToken,
  profileController.getUserProfileDetails
);

/**
 * @swagger
 * /api/profile/user-profile-details:
 *   post:
 *     summary: Upsert user profile details (create or update)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HealthFocus: { type: string, example: "Weight Loss" }
 *               MotivationLevel: { type: integer, example: 4 }
 *     responses:
 *       200:
 *         description: User profile details upserted successfully
 *       500:
 *         description: Error upserting user profile details
 */
router.post(
  "/user-profile-details",
  authenticateToken,
  profileController.upsertUserProfileDetails
);

/**
 * @swagger
 * /api/profile/user-profile-details:
 *   put:
 *     summary: Edit user profile details (update only provided fields)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HealthFocus: { type: string, example: "Fitness" }
 *               MotivationLevel: { type: integer, example: 5 }
 *     responses:
 *       200:
 *         description: User profile details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User profile details updated successfully" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id: { type: string, format: uuid }
 *                     UserId: { type: string, format: uuid }
 *                     HealthFocus: { type: string, example: "Fitness" }
 *                     MotivationLevel: { type: integer, example: 5 }
 *                     CreatedAt: { type: string, format: date-time }
 *                     UpdatedAt: { type: string, format: date-time }
 *       400:
 *         description: Validation error (missing fields or invalid MotivationLevel)
 *       404:
 *         description: User profile details not found
 *       500:
 *         description: Error updating user profile details
 */
router.put(
  "/user-profile-details",
  authenticateToken,
  profileController.editUserProfileDetails
);

/**
 * @swagger
 * /api/profile/user-action-plan-narratives:
 *   get:
 *     summary: Get all user action plan narratives for the authenticated user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User action plan narratives fetched successfully
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
 *                   example: "User action plan narratives fetched successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       NarrativeID:
 *                         type: integer
 *                         example: 1
 *                       OrderNo:
 *                         type: string
 *                         example: "ORD-12345"
 *                       SummaryText:
 *                         type: string
 *                         example: "This is a summary for the user's action plan."
 *                       DisplayStartDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-15T00:00:00Z"
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-10T12:00:00Z"
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-12T12:00:00Z"
 *       400:
 *         description: User ID is required
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
 *                   example: "User ID is required."
 *       500:
 *         description: Failed to fetch user action plan narratives
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
 *                   example: "Failed to fetch user action plan narratives."
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.get(
  "/user-action-plan-narratives",
  authenticateToken,
  profileController.getUserActionPlanNarratives
);

/**
 * @swagger
 * /api/profile/user-action-plan-narratives/{narrativeId}:
 *   get:
 *     summary: Get a user action plan narrative and its sections by NarrativeID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: narrativeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The NarrativeID of the user action plan narrative
 *     responses:
 *       200:
 *         description: User action plan narrative fetched successfully
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
 *                   example: "User action plan narrative fetched successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     NarrativeID:
 *                       type: integer
 *                       example: 1
 *                     UserID:
 *                       type: string
 *                       format: uuid
 *                     OrderNo:
 *                       type: string
 *                       example: "ORD-12345"
 *                     SummaryText:
 *                       type: string
 *                       example: "This is a summary for the user's action plan."
 *                     DisplayStartDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-15T00:00:00Z"
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-10T12:00:00Z"
 *                     UpdatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-12T12:00:00Z"
 *                     Sections:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           SectionID:
 *                             type: integer
 *                             example: 10
 *                           SectionOrder:
 *                             type: integer
 *                             example: 1
 *                           SectionHeading:
 *                             type: string
 *                             example: "Introduction"
 *                           SectionBody:
 *                             type: string
 *                             example: "This is the body of the section."
 *                           SectionCreatedAt:
 *                             type: string
 *                             format: date-time
 *                           SectionUpdatedAt:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: NarrativeID is required or invalid
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
 *                   example: "NarrativeID is required."
 *       404:
 *         description: User action plan narrative not found
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
 *                   example: "User action plan narrative not found."
 *       500:
 *         description: Failed to fetch user action plan narrative
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
 *                   example: "Failed to fetch user action plan narrative."
 */
router.get(
  "/user-action-plan-narratives/:narrativeId",
  authenticateToken,
  profileController.getUserActionPlanNarrativeByNarrativeID
);

router.get(
  "/eating-preferences",
  authenticateToken,
  profileController.getUserEatingPreferences
);

router.post(
  "/eating-preferences",
  authenticateToken,
  profileController.addUserEatingPreferences
);

router.delete(
  "/eating-preferences",
  authenticateToken,
  profileController.removeEatingPreferences
);

module.exports = router;
