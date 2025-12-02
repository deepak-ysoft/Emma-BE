const express = require('express');
const multer = require('multer');
const blobController = require('../controllers/blobController');
const authController = require('../controllers/authController');
const router = express.Router();
const upload = multer();
const authenticateToken = require('../middleware/authenticate'); // Add this line

//route for image upload
/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image to Azure Blob Storage
 *     description: Uploads an image and stores it in Azure Blob Storage.
 *     tags: [Blob]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (logo or any other image).
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Logo uploaded successfully"
 *               data:
 *                 imageUrl: "https://azure.blob.storage/path/to/uploaded-image"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Validation error"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */
router.post('/upload', upload.single('file'), blobController.uploadLogos);

//route for check file exists
/**
 * @swagger
 * /api/check/{fileName}:
 *   get:
 *     summary: Check if a file exists
 *     tags: [Blob]
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to check
 *     responses:
 *       200:
 *         description: File existence status
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "File existence status"
 *               data:
 *                 exists: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */
router.get('/check/:fileName', blobController.checkFileExists);

//route for delete file
/**
 * @swagger
 * /api/delete/{fileName}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Blob]
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "File deleted successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */
router.delete('/delete/:fileName', blobController.deleteFile);

// route for get home data api
/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Retrieve home data for the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Home data retrieved successfully
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
 *         description: No home data found for the given user
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
 *                   example: "No home data found for the given user"
 *       500:
 *         description: Failed to retrieve home data
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
 *                   example: "Failed to retrieve home data"
 */
router.get('/home', authenticateToken, authController.getHomeData);

// route for get user api
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve user details for the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     user_name:
 *                       type: string
 *                       example: "JohnDoe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     date_of_birth:
 *                       type: string
 *                       example: "1990-01-01"
 *                     phone_number:
 *                       type: string
 *                       example: "123-456-7890"
 *                     state:
 *                       type: string
 *                       example: "CA"
 *                     city:
 *                       type: string
 *                       example: "San Diego"
 *                     zip_code:
 *                       type: string
 *                       example: "92101"
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
 *         description: Failed to retrieve user
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
 *                   example: "Failed to retrieve user"
 */
router.get('/user', authenticateToken, authController.getUser);


module.exports = router;
