const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const actionController = require('../controllers/actionController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * /api/admin/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "Low FODMAP"
 *               Description:
 *                 type: string
 *                 example: "Foods that are low in fermentable oligosaccharides, disaccharides, monosaccharides, and polyols."
 *               Status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: "Active"
 *     responses:
 *       200:
 *         description: Tag created successfully
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
 *                   example: "Tag created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       format: uuid
 *                     Name:
 *                       type: string
 *                     Description:
 *                       type: string
 *                     Status:
 *                       type: string
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                     UpdatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Tag name is required or status is invalid
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
 *                   example: "Tag name is required."
 *       409:
 *         description: Tag with this name already exists
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
 *                   example: "A tag with this name already exists."
 *       500:
 *         description: Failed to create tag
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
 *                   example: "Failed to create tag"
 */
router.post('/tags', adminController.createTag);

/**
 * @swagger
 * /api/admin/tags/{id}:
 *   put:
 *     summary: Update an existing tag
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "Low FODMAP"
 *               Description:
 *                 type: string
 *                 example: "Updated description."
 *               Status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: "Inactive"
 *     responses:
 *       200:
 *         description: Tag updated successfully
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
 *                   example: "Tag updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       format: uuid
 *                     Name:
 *                       type: string
 *                     Description:
 *                       type: string
 *                     Status:
 *                       type: string
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                     UpdatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Tag ID is required or status is invalid
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
 *                   example: "Tag ID is required."
 *       404:
 *         description: Tag not found
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
 *                   example: "Tag not found."
 *       409:
 *         description: Tag with this name already exists
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
 *                   example: "A tag with this name already exists."
 *       500:
 *         description: Failed to update tag
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
 *                   example: "Failed to update tag"
 */
router.put('/tags/:id', adminController.updateTag);

/**
 * @swagger
 * /api/admin/tags:
 *   get:
 *     summary: Get all tags (optionally filtered by status)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: Status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         required: false
 *         description: Filter tags by status (Active or Inactive)
 *     responses:
 *       200:
 *         description: List of tags
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
 *                     properties:
 *                       Id:
 *                         type: string
 *                         format: uuid
 *                       Name:
 *                         type: string
 *                       Description:
 *                         type: string
 *                       Status:
 *                         type: string
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Status is invalid
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
 *                   example: "Status must be either Active, Inactive, or NULL."
 *       500:
 *         description: Failed to retrieve tags
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
 *                   example: "Failed to retrieve tags"
 */
router.get('/tags', adminController.getAllTags);

/**
 * @swagger
 * /api/admin/tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The tag ID
 *     responses:
 *       200:
 *         description: Tag deleted successfully
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
 *                   example: "Tag deleted successfully."
 *       400:
 *         description: Tag ID is required
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
 *                   example: "Tag ID is required."
 *       404:
 *         description: Tag not found
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
 *                   example: "Tag not found."
 *       409:
 *         description: Tag is referenced by other records
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
 *                   example: "Cannot delete tag because it is referenced by other records."
 *       500:
 *         description: Failed to delete tag
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
 *                   example: "Failed to delete tag"
 */
router.delete('/tags/:id', adminController.deleteTag);

/**
 * @swagger
 * /api/admin/learning-videos:
 *   post:
 *     summary: Create a new learning video
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *             properties:
 *               Title:
 *                 type: string
 *                 example: "How to Cook Rice"
 *               TitleThumbnailUrl:
 *                 type: string
 *                 description: "Provide a thumbnail URL if not uploading a file"
 *                 example: "https://example.com/thumbnail.jpg"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: "Upload a thumbnail image file (optional, takes precedence over TitleThumbnailUrl)"
 *               Description:
 *                 type: string
 *                 example: "A step-by-step guide to cooking rice."
 *               Category:
 *                 type: string
 *                 example: "Cooking"
 *               Duration:
 *                 type: integer
 *                 example: 300
 *               PublicationDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-01T12:00:00Z"
 *               ViewCount:
 *                 type: integer
 *                 example: 0
 *               VideoUrl:
 *                 type: string
 *                 description: "Provide a video URL if not uploading a file"
 *                 example: "https://example.com/video.mp4"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: "Upload a video file (optional, takes precedence over VideoUrl)"
 *               Instructor:
 *                 type: string
 *                 example: "Chef John"
 *               Status:
 *                 type: string
 *                 enum: [Active, Inactive, Draft]
 *                 example: "Active"
 *               TagId:
 *                 type: string
 *                 format: uuid
 *                 example: "b6e6e7d2-8c3b-4c3e-9e2e-1a2b3c4d5e6f"
 *           encoding:
 *             thumbnail:
 *               contentType: image/*
 *             video:
 *               contentType: video/*
 *     responses:
 *       200:
 *         description: Learning video created successfully
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
 *                   example: "Learning video created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       format: uuid
 *                     Title:
 *                       type: string
 *                     TitleThumbnailUrl:
 *                       type: string
 *                     Description:
 *                       type: string
 *                     Category:
 *                       type: string
 *                     Duration:
 *                       type: integer
 *                     PublicationDate:
 *                       type: string
 *                       format: date-time
 *                     ViewCount:
 *                       type: integer
 *                     Date:
 *                       type: string
 *                       format: date-time
 *                     VideoUrl:
 *                       type: string
 *                     Instructor:
 *                       type: string
 *                     Status:
 *                       type: string
 *                     TagId:
 *                       type: string
 *                       format: uuid
 *       400:
 *         description: Validation error (missing required fields or invalid status/tag)
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
 *                   example: "Title is required."
 *       409:
 *         description: Duplicate title or video URL
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
 *                   example: "A video with this title already exists."
 *       500:
 *         description: Failed to create learning video
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
 *                   example: "Failed to create learning video"
 */
router.post('/learning-videos', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), adminController.createLearningVideo);

/**
 * @swagger
 * /api/admin/learning-videos:
 *   get:
 *     summary: Get all learning videos or filter by TagId
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: TagId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Filter videos by TagId
 *     responses:
 *       200:
 *         description: List of learning videos
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
 *                     properties:
 *                       Id:
 *                         type: string
 *                         format: uuid
 *                       Title:
 *                         type: string
 *                       TitleThumbnailUrl:
 *                         type: string
 *                       Description:
 *                         type: string
 *                       Category:
 *                         type: string
 *                       Duration:
 *                         type: integer
 *                       PublicationDate:
 *                         type: string
 *                         format: date-time
 *                       URL:
 *                         type: string
 *                       ViewCount:
 *                         type: integer
 *                       Date:
 *                         type: string
 *                         format: date-time
 *                       VideoUrl:
 *                         type: string
 *                       Instructor:
 *                         type: string
 *                       Status:
 *                         type: string
 *       500:
 *         description: Failed to retrieve learning videos
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
 *                   example: "Failed to retrieve learning video(s)"
 */
router.get('/learning-videos', adminController.getLearningVideo);

/**
 * @swagger
 * /api/admin/learning-videos/{id}:
 *   get:
 *     summary: Get a specific learning video by ID (with tags)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The video ID
 *     responses:
 *       200:
 *         description: Learning video details with tags
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
 *                     TitleThumbnailUrl:
 *                       type: string
 *                     Description:
 *                       type: string
 *                     Category:
 *                       type: string
 *                     Duration:
 *                       type: integer
 *                     PublicationDate:
 *                       type: string
 *                       format: date-time
 *                     URL:
 *                       type: string
 *                     ViewCount:
 *                       type: integer
 *                     Date:
 *                       type: string
 *                       format: date-time
 *                     VideoUrl:
 *                       type: string
 *                     Instructor:
 *                       type: string
 *                     Status:
 *                       type: string
 *                     Tags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           Id:
 *                             type: string
 *                             format: uuid
 *                           Name:
 *                             type: string
 *                           Description:
 *                             type: string
 *                           Status:
 *                             type: string
 *                           CreatedAt:
 *                             type: string
 *                             format: date-time
 *                           UpdatedAt:
 *                             type: string
 *                             format: date-time
 *       404:
 *         description: Video not found
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
 *                   example: "Video not found."
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
 *                   example: "Failed to retrieve learning video(s)"
 */
router.get('/learning-videos/:id', adminController.getLearningVideo);

/**
 * @swagger
 * /api/admin/learning-videos/{id}:
 *   delete:
 *     summary: Delete a learning video
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The video ID
 *     responses:
 *       200:
 *         description: Learning video deleted successfully
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
 *                   example: "Learning video deleted successfully."
 *       400:
 *         description: Video ID is required
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
 *                   example: "Video ID is required."
 *       404:
 *         description: Video not found
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
 *                   example: "Video not found."
 *       409:
 *         description: Video is referenced by other records
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
 *                   example: "Cannot delete video because it is referenced by other records."
 *       500:
 *         description: Failed to delete learning video
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
 *                   example: "Failed to delete learning video"
 */
router.delete('/learning-videos/:id', adminController.deleteLearningVideo);

/**
 * @swagger
 * /api/admin/learning-videos/{id}:
 *   put:
 *     summary: Update an existing learning video
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The video ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *                 example: "How to Cook Rice (Updated)"
 *               TitleThumbnailUrl:
 *                 type: string
 *                 description: "Provide a thumbnail URL if not uploading a file"
 *                 example: "https://example.com/thumbnail.jpg"
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: "Upload a thumbnail image file (optional, takes precedence over TitleThumbnailUrl)"
 *               Description:
 *                 type: string
 *                 example: "Updated description."
 *               Category:
 *                 type: string
 *                 example: "Cooking"
 *               Duration:
 *                 type: integer
 *                 example: 350
 *               PublicationDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-01T12:00:00Z"
 *               ViewCount:
 *                 type: integer
 *                 example: 10
 *               VideoUrl:
 *                 type: string
 *                 description: "Provide a video URL if not uploading a file"
 *                 example: "https://example.com/video.mp4"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: "Upload a video file (optional, takes precedence over VideoUrl)"
 *               Instructor:
 *                 type: string
 *                 example: "Chef John"
 *               Status:
 *                 type: string
 *                 enum: [Active, Inactive, Draft]
 *                 example: "Active"
 *               TagId:
 *                 type: string
 *                 format: uuid
 *                 example: "b6e6e7d2-8c3b-4c3e-9e2e-1a2b3c4d5e6f"
 *           encoding:
 *             thumbnail:
 *               contentType: image/*
 *             video:
 *               contentType: video/*
 *     responses:
 *       200:
 *         description: Learning video updated successfully
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
 *                   example: "Learning video updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       format: uuid
 *                     Title:
 *                       type: string
 *                     TitleThumbnailUrl:
 *                       type: string
 *                     Description:
 *                       type: string
 *                     Category:
 *                       type: string
 *                     Duration:
 *                       type: integer
 *                     PublicationDate:
 *                       type: string
 *                       format: date-time
 *                     URL:
 *                       type: string
 *                     ViewCount:
 *                       type: integer
 *                     Date:
 *                       type: string
 *                       format: date-time
 *                     VideoUrl:
 *                       type: string
 *                     Instructor:
 *                       type: string
 *                     Status:
 *                       type: string
 *                     TagId:
 *                       type: string
 *                       format: uuid
 *       400:
 *         description: Validation error (invalid status/tag)
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
 *                   example: "Status must be Active, Inactive, or Draft."
 *       404:
 *         description: Video not found
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
 *                   example: "Video not found."
 *       409:
 *         description: Duplicate title or video URL
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
 *                   example: "A video with this title already exists."
 *       500:
 *         description: Failed to update learning video
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
 *                   example: "Failed to update learning video"
 */
router.put('/learning-videos/:id', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), adminController.updateLearningVideo);

/**
 * @swagger
 * /api/admin/daily-challenges:
 *   post:
 *     summary: Create a new daily challenge
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *               - Description
 *             properties:
 *               Title:
 *                 type: string
 *                 example: "Drink 8 Glasses of Water"
 *               Description:
 *                 type: string
 *                 example: "Stay hydrated by drinking at least 8 glasses of water today."
 *               WhyItMatters:
 *                 type: string
 *                 example: "Hydration is essential for health and well-being."
 *     responses:
 *       201:
 *         description: Daily challenge created successfully
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
 *                   example: "Daily challenge created successfully"
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
 *                     WhyItMatters:
 *                       type: string
 *       400:
 *         description: Title or Description is required
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
 *                   example: "Title is required."
 *       500:
 *         description: Failed to create daily challenge
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
 *                   example: "Failed to create daily challenge"
 */
router.post('/daily-challenges', adminController.createDailyChallenge);

/**
 * @swagger
 * /api/admin/daily-challenges:
 *   get:
 *     summary: Get all daily challenges (optionally include past)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: IncludePast
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, include past challenges. If false or omitted, only future/today's challenges are returned.
 *     responses:
 *       200:
 *         description: List of daily challenges
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
 *                     properties:
 *                       Id:
 *                         type: string
 *                         format: uuid
 *                       Title:
 *                         type: string
 *                       Description:
 *                         type: string
 *                       WhyItMatters:
 *                         type: string
 *       500:
 *         description: Failed to retrieve daily challenges
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
 *                   example: "Failed to retrieve daily challenges"
 */
router.get('/daily-challenges', adminController.getAllDailyChallenges);

/**
 * @swagger
 * /api/admin/daily-challenges/{id}:
 *   put:
 *     summary: Update an existing daily challenge
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The challenge ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *                 example: "Drink 10 Glasses of Water"
 *               Description:
 *                 type: string
 *                 example: "Stay hydrated by drinking at least 10 glasses of water today."
 *               WhyItMatters:
 *                 type: string
 *                 example: "Hydration is essential for health and well-being."
 *     responses:
 *       200:
 *         description: Daily challenge updated successfully
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
 *                   example: "Daily challenge updated successfully."
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
 *                     WhyItMatters:
 *                       type: string
 *       400:
 *         description: Challenge ID is required
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
 *                   example: "Challenge ID is required."
 *       404:
 *         description: Daily challenge not found
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
 *                   example: "Daily challenge not found."
 *       500:
 *         description: Failed to update daily challenge
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
 *                   example: "Failed to update daily challenge"
 */
router.put('/daily-challenges/:id', adminController.updateDailyChallenge);

/**
 * @swagger
 * /api/admin/daily-challenges/{id}:
 *   delete:
 *     summary: Delete a daily challenge
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The challenge ID
 *     responses:
 *       200:
 *         description: Daily challenge deleted successfully
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
 *                   example: "Daily challenge deleted successfully."
 *       400:
 *         description: Challenge ID is required
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
 *                   example: "Challenge ID is required."
 *       404:
 *         description: Daily challenge not found
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
 *                   example: "Daily challenge not found."
 *       409:
 *         description: Challenge is referenced by other records
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
 *                   example: "Cannot delete challenge - it is being referenced by other records."
 *       500:
 *         description: Failed to delete daily challenge
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
 *                   example: "Failed to delete daily challenge"
 */
router.delete('/daily-challenges/:id', adminController.deleteDailyChallenge);

/**
 * @swagger
 * /api/admin/ingredient-categories:
 *   post:
 *     summary: Create a new ingredient category
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Keyword
 *               - CategoryName
 *             properties:
 *               Keyword:
 *                 type: string
 *                 example: "fruit"
 *               CategoryName:
 *                 type: string
 *                 example: "Fruits"
 *     responses:
 *       200:
 *         description: Ingredient category created successfully
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
 *                   example: "Ingredient category created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     IngredientCategoryId:
 *                       type: integer
 *                       example: 1
 *                     Keyword:
 *                       type: string
 *                       example: "fruit"
 *                     CategoryName:
 *                       type: string
 *                       example: "Fruits"
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                     UpdatedAt:
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
 *                   example: "Keyword is required."
 *       500:
 *         description: Failed to create ingredient category
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
 *                   example: "Failed to create ingredient category"
 */
router.post('/ingredient-categories', adminController.createIngredientCategory);

/**
 * @swagger
 * /api/admin/ingredient-categories/{id}:
 *   put:
 *     summary: Update an existing ingredient category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ingredient category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Keyword
 *               - CategoryName
 *             properties:
 *               Keyword:
 *                 type: string
 *                 example: "fruit"
 *               CategoryName:
 *                 type: string
 *                 example: "Fruits"
 *     responses:
 *       200:
 *         description: Ingredient category updated successfully
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
 *                   example: "Ingredient category updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     IngredientCategoryId:
 *                       type: integer
 *                       example: 1
 *                     Keyword:
 *                       type: string
 *                       example: "fruit"
 *                     CategoryName:
 *                       type: string
 *                       example: "Fruits"
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                     UpdatedAt:
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
 *                   example: "Keyword is required."
 *       404:
 *         description: Ingredient category not found
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
 *                   example: "Ingredient category not found."
 *       500:
 *         description: Failed to update ingredient category
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
 *                   example: "Failed to update ingredient category"
 */
router.put('/ingredient-categories/:id', adminController.updateIngredientCategory);

/**
 * @swagger
 * /api/admin/ingredient-categories:
 *   get:
 *     summary: Get all ingredient categories
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of ingredient categories
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
 *                     properties:
 *                       IngredientCategoryId:
 *                         type: integer
 *                         example: 1
 *                       Keyword:
 *                         type: string
 *                         example: "fruit"
 *                       CategoryName:
 *                         type: string
 *                         example: "Fruits"
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Failed to retrieve ingredient categories
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
 *                   example: "Failed to retrieve ingredient categories"
 */
router.get('/ingredient-categories', adminController.getAllIngredientCategories);

/**
 * @swagger
 * /api/admin/ingredient-categories/{id}:
 *   delete:
 *     summary: Delete an ingredient category
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ingredient category ID
 *     responses:
 *       200:
 *         description: Ingredient category deleted successfully
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
 *                   example: "Ingredient category deleted successfully."
 *       400:
 *         description: IngredientCategoryId is required
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
 *                   example: "IngredientCategoryId is required."
 *       404:
 *         description: Ingredient category not found
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
 *                   example: "Ingredient category not found."
 *       500:
 *         description: Failed to delete ingredient category
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
 *                   example: "Failed to delete ingredient category"
 */
router.delete('/ingredient-categories/:id', adminController.deleteIngredientCategory);

/**
 * @swagger
 * /api/admin/recipes/json:
 *   post:
 *     summary: Create a new recipe with instructions and ingredients from JSON
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - mealType
 *               - estimatedPrepTime
 *               - estimatedCookTime
 *               - instructions
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Spaghetti Bolognese"
 *               description:
 *                 type: string
 *                 example: "A classic Italian pasta dish."
 *               mealType:
 *                 type: string
 *                 example: "Dinner"
 *               estimatedPrepTime:
 *                 type: integer
 *                 example: 15
 *               estimatedCookTime:
 *                 type: integer
 *                 example: 30
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               educationalNote:
 *                 type: string
 *                 example: "Great source of protein."
 *               loggable:
 *                 type: boolean
 *                 example: true
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - stepOrder
 *                     - instruction
 *                   properties:
 *                     stepOrder:
 *                       type: integer
 *                       example: 1
 *                     instruction:
 *                       type: string
 *                       example: "Boil water and cook pasta."
 *               recipeIngredient:
 *                 type: array
 *                 description: "Array of ingredients for the recipe"
 *                 items:
 *                   type: object
 *                   required:
 *                     - ingredient_id
 *                     - amount
 *                   properties:
 *                     ingredient_id:
 *                       type: integer
 *                       example: 2
 *                     amount:
 *                       type: string
 *                       example: "200g"
 *                     notes:
 *                       type: string
 *                       example: "Use fresh if possible"
 *               tags:
 *                 type: array
 *                 description: "Array of tag UUIDs"
 *                 items:
 *                   type: string
 *                   format: uuid
 *                   example: "b6e6e7d2-8c3b-4c3e-9e2e-1a2b3c4d5e6f"
 *     responses:
 *       201:
 *         description: Recipe created successfully
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
 *                   example: "Recipe created successfully"
 *                 recipeId:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: Invalid input or missing/invalid fields (including invalid tag IDs)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "Title is required."
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "One or more tag IDs are invalid or do not exist."
 *       500:
 *         description: Failed to create recipe
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
 *                   example: "Failed to create recipe"
 */
router.post('/recipes/json', adminController.createRecipeWithInstructionsFromJson);

/**
 * @swagger
 * /api/admin/recipes/json/{id}:
 *   get:
 *     summary: Get a recipe with instructions and ingredients by RecipeId
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Recipe ID
 *     responses:
 *       200:
 *         description: Recipe found
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
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     mealType:
 *                       type: string
 *                     estimatedPrepTime:
 *                       type: integer
 *                     estimatedCookTime:
 *                       type: integer
 *                     imageUrl:
 *                       type: string
 *                     educationalNote:
 *                       type: string
 *                     loggable:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     instructions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           stepOrder:
 *                             type: integer
 *                           instruction:
 *                             type: string
 *                     recipeIngredient:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           amount:
 *                             type: string
 *                           notes:
 *                             type: string
 *                           ingredient_id:
 *                             type: integer
 *                           categoryName:
 *                             type: string
 *       400:
 *         description: Recipe ID is required
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
 *                   example: "Recipe ID is required."
 *       404:
 *         description: Recipe not found
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
 *                   example: "Recipe not found."
 *       500:
 *         description: Failed to retrieve recipe
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
 *                   example: "Failed to retrieve recipe"
 */
router.get('/recipes/json/:id', adminController.getRecipeWithInstructionsAndIngredients);

/**
 * @swagger
 * /api/admin/recipes/json/{id}:
 *   delete:
 *     summary: Delete a recipe and its instructions/ingredients by RecipeId
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Recipe ID
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
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
 *                   example: "Recipe deleted successfully."
 *       400:
 *         description: Recipe ID is required
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
 *                   example: "Recipe ID is required."
 *       404:
 *         description: Recipe not found
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
 *                   example: "Recipe not found."
 *       500:
 *         description: Failed to delete recipe
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
 *                   example: "Failed to delete recipe"
 */
router.delete('/recipes/json/:id', adminController.deleteRecipeWithDependencies);

/**
 * @swagger
 * /api/admin/contact-us:
 *   get:
 *     summary: Get all contact us submissions (paginated, optionally filtered by status)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: Status
 *         schema:
 *           type: string
 *           enum: [Pending, Resolved, Closed]
 *         required: false
 *         description: Filter submissions by status
 *       - in: query
 *         name: PageNumber
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number (default 1)
 *       - in: query
 *         name: PageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Page size (default 10)
 *     responses:
 *       200:
 *         description: Contact submissions retrieved successfully
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
 *                   example: "Contact submissions retrieved successfully."
 *                 totalCount:
 *                   type: integer
 *                   example: 25
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Id:
 *                         type: string
 *                         format: uuid
 *                       UserId:
 *                         type: string
 *                         format: uuid
 *                       userFullName:
 *                         type: string
 *                       userEmail:
 *                         type: string
 *                       Name:
 *                         type: string
 *                       Email:
 *                         type: string
 *                       Subject:
 *                         type: string
 *                       Message:
 *                         type: string
 *                       Status:
 *                         type: string
 *                         example: "Pending"
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Failed to retrieve contact submissions
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
 *                   example: "Failed to retrieve contact submissions."
 */
router.get('/contact-us', adminController.getAllContactUsSubmissions);

/**
 * @swagger
 * /api/admin/contact-us/{id}/status:
 *   put:
 *     summary: Update the status of a contact us submission
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The contact submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Status
 *             properties:
 *               Status:
 *                 type: string
 *                 enum: [Pending, InProgress, Resolved, Rejected]
 *                 example: "Resolved"
 *     responses:
 *       200:
 *         description: Contact submission status updated successfully
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
 *                   example: "Contact submission status updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id:
 *                       type: string
 *                       format: uuid
 *                     Status:
 *                       type: string
 *                       example: "Resolved"
 *                     UpdatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid status value or missing fields
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
 *                   example: "Invalid status value."
 *       404:
 *         description: Contact submission not found
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
 *                   example: "Contact submission not found."
 *       500:
 *         description: Error updating contact submission status
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
 *                   example: "Error updating contact submission status: ..."
 */
router.put('/contact-us/:id/status', adminController.updateContactUsStatus);

/**
 * @swagger
 * /api/admin/recipes:
 *   get:
 *     summary: Get all recipes with instructions and ingredients
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, format: uuid }
 *                       title: { type: string }
 *                       description: { type: string }
 *                       mealType: { type: string }
 *                       estimatedPrepTime: { type: integer }
 *                       estimatedCookTime: { type: integer }
 *                       imageUrl: { type: string }
 *                       educationalNote: { type: string }
 *                       loggable: { type: boolean }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *                       instructions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             stepOrder: { type: integer }
 *                             instruction: { type: string }
 *                       recipeIngredient:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name: { type: string }
 *                             amount: { type: string }
 *                             notes: { type: string }
 *                             ingredient_id: { type: integer }
 *                             categoryName: { type: string }
 *       404:
 *         description: No recipes found
 *       500:
 *         description: Failed to retrieve recipes
 */
router.get('/recipes', adminController.getAllRecipes);

/**
 * @swagger
 * /api/admin/goals:
 *   post:
 *     summary: Create a new goal with instructions and benefits
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Walk 10,000 steps"
 *               description:
 *                 type: string
 *                 example: "Achieve 10,000 steps in a day."
 *               category:
 *                 type: string
 *                 example: "Fitness"
 *               status:
 *                 type: boolean
 *                 example: true
 *               frequency:
 *                 type: string
 *                 example: "Daily"
 *                 description: How often the goal should be done
 *               videoContentTitle:
 *                 type: string
 *                 example: "Walking Exercise Tutorial"
 *                 description: Title of associated video content
 *               videoContentLnk:
 *                 type: string
 *                 example: "https://example.com/walking-tutorial"
 *                 description: Link to associated video content
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stepNumber:
 *                       type: integer
 *                       example: 1
 *                     instruction:
 *                       type: string
 *                       example: "Start walking in the morning."
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Improves cardiovascular health"
 *     responses:
 *       201:
 *         description: Goal created successfully
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
 *                   example: "Goal created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     goalId:
 *                       type: string
 *                       format: uuid
 *                       description: The unique identifier of the created goal
 *       400:
 *         description: Invalid input or missing required fields
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
 *                   example: "Missing required fields: title, description, category"
 *       500:
 *         description: Failed to create goal
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
 *                   example: "Failed to create goal"
 */
router.post('/goals', adminController.createGoal);

/**
 * @swagger
 * /api/admin/goals/{id}:
 *   put:
 *     summary: Update an existing goal
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Walk 12,000 steps"
 *               description:
 *                 type: string
 *                 example: "Achieve 12,000 steps in a day."
 *               category:
 *                 type: string
 *                 example: "Fitness"
 *               status:
 *                 type: boolean
 *                 example: true
 *               frequency:
 *                 type: string
 *                 example: "Daily"
 *                 description: How often the goal should be done
 *               videoContentTitle:
 *                 type: string
 *                 example: "Advanced Walking Exercise Tutorial"
 *                 description: Title of associated video content
 *               videoContentLnk:
 *                 type: string
 *                 example: "https://example.com/advanced-walking-tutorial"
 *                 description: Link to associated video content
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stepNumber:
 *                       type: integer
 *                       example: 1
 *                     instruction:
 *                       type: string
 *                       example: "Start walking in the morning."
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Improves cardiovascular health"
 *     responses:
 *       200:
 *         description: Goal updated successfully
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
 *                   example: "Goal updated successfully."
 *       400:
 *         description: Invalid input or no valid fields provided
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
 *                   example: "No valid fields provided for update."
 *       404:
 *         description: Goal not found
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
 *                   example: "Goal not found."
 *       500:
 *         description: Failed to update goal
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
 *                   example: "Failed to update goal."
 */
router.put('/goals/:id', adminController.updateGoal);

/**
 * @swagger
 * /api/admin/goals:
 *   get:
 *     summary: Get all goals with instructions, benefits, and associated action plans
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retrieves all goals with their complete information including:
 *       - Goal details (title, description, status, category, frequency)
 *       - Video content information (title and link)
 *       - Step-by-step instructions
 *       - Benefits of achieving the goal
 *       - Associated action plans
 *     responses:
 *       200:
 *         description: List of goals with complete information
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
 *                   example: "Goals retrieved successfully"
 *                 data:
 *                   type: array
 *                   description: Array of goals with complete information
 *                   items:
 *                     type: object
 *                     properties:
 *                       goalId:
 *                         type: string
 *                         format: uuid
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                         description: The unique identifier of the goal
 *                       Title:
 *                         type: string
 *                         example: "Daily Exercise Routine"
 *                         description: The title of the goal
 *                       Description:
 *                         type: string
 *                         example: "Establish a consistent daily exercise routine"
 *                         description: The description of the goal
 *                       Status:
 *                         type: string
 *                         example: "Active"
 *                         description: The current status of the goal
 *                       Category:
 *                         type: string
 *                         example: "Fitness"
 *                         description: The category of the goal
 *                       Frequency:
 *                         type: string
 *                         example: "Daily"
 *                         description: How often the goal should be performed
 *                       VideoContentTitle:
 *                         type: string
 *                         example: "How to Start Exercising"
 *                         description: Title of the associated video content
 *                       VideoContentLnk:
 *                         type: string
 *                         example: "https://example.com/video"
 *                         description: Link to the associated video content
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the goal was created
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the goal was last updated
 *                       Instructions:
 *                         type: array
 *                         description: Step-by-step instructions for the goal
 *                         items:
 *                           type: object
 *                           properties:
 *                             StepNumber:
 *                               type: integer
 *                               example: 1
 *                               description: The step number
 *                             Instruction:
 *                               type: string
 *                               example: "Start with 10 minutes of light stretching"
 *                               description: The instruction text
 *                       Benefits:
 *                         type: array
 *                         description: Benefits of achieving this goal
 *                         items:
 *                           type: object
 *                           properties:
 *                             Benefit:
 *                               type: string
 *                               example: "Improved cardiovascular health"
 *                               description: A benefit of achieving the goal
 *                       ActionPlans:
 *                         type: array
 *                         description: Associated action plans for this goal
 *                         items:
 *                           type: object
 *                           properties:
 *                             ActionPlanId:
 *                               type: string
 *                               format: uuid
 *                               example: "456e7890-e89b-12d3-a456-426614174000"
 *                               description: The unique identifier of the action plan
 *                             ActionPlanTitle:
 *                               type: string
 *                               example: "Morning Exercise Routine"
 *                               description: The title of the action plan
 *                             ActionPlanDescription:
 *                               type: string
 *                               example: "A structured morning exercise routine"
 *                               description: The description of the action plan
 *                             ActionPlanWhyItMatters:
 *                               type: string
 *                               example: "Exercise improves overall health and energy"
 *                               description: Why the action plan matters
 *                             AssignedAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2024-01-15T10:30:00Z"
 *                               description: When the action plan was assigned to this goal
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
 *                   example: "Failed to retrieve goals."
 *                 error:
 *                   type: string
 *                   description: Detailed error message (only in development)
 */
router.get('/goals', adminController.getAllGoals);

/**
 * @swagger
 * /api/admin/goals/{id}/status:
 *   put:
 *     summary: Set goal status (active/inactive)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Goal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *                 description: true for active, false for inactive
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Status updated successfully." }
 *       400:
 *         description: Goal ID and status are required
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Failed to update goal status
 */
router.put('/goals/:id/status', adminController.setGoalStatus);

/**
 * @swagger
 * /api/admin/recipes/{id}:
 *   put:
 *     summary: Update a recipe with instructions and ingredients from JSON
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Spaghetti Bolognese"
 *               description:
 *                 type: string
 *                 example: "A classic Italian pasta dish."
 *               mealType:
 *                 type: string
 *                 example: "Dinner"
 *               estimatedPrepTime:
 *                 type: integer
 *                 example: 15
 *               estimatedCookTime:
 *                 type: integer
 *                 example: 30
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               educationalNote:
 *                 type: string
 *                 example: "Great source of protein."
 *               loggable:
 *                 type: boolean
 *                 example: true
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stepOrder:
 *                       type: integer
 *                       example: 1
 *                     instruction:
 *                       type: string
 *                       example: "Boil water and cook pasta."
 *               recipeIngredient:
 *                 type: array
 *                 description: "Array of ingredients for the recipe"
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredient_id:
 *                       type: integer
 *                       example: 2
 *                     amount:
 *                       type: string
 *                       example: "200g"
 *                     notes:
 *                       type: string
 *                       example: "Use fresh if possible"
 *     responses:
 *       200:
 *         description: Recipe updated successfully
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
 *                   example: "Recipe updated successfully."
 *                 recipeId:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: Invalid input or missing/invalid fields
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
 *                   example: "At least one valid instruction is required when provided."
 *       404:
 *         description: Recipe not found
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
 *                   example: "Recipe not found."
 *       500:
 *         description: Failed to update recipe
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
 *                   example: "Failed to update recipe."
 */
router.put('/recipes/:id', adminController.updateRecipeWithInstructionsFromJson);

/**
 * @swagger
 * /api/admin/supplements:
 *   post:
 *     summary: Create a new supplement with benefits, warnings, and drug interactions from JSON
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vitamin D"
 *               description:
 *                 type: string
 *                 example: "Supports bone health and immune function."
 *               category:
 *                 type: string
 *                 example: "Vitamins"
 *               dosage:
 *                 type: string
 *                 example: "1000 IU"
 *               dosageInstructions:
 *                 type: string
 *                 example: "Take with food"
 *               timing:
 *                 type: string
 *                 example: "Morning"
 *               status:
 *                 type: boolean
 *                 example: true
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Supports immune system"
 *               warnings:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Do not exceed recommended dose"
 *               drugInteractions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "May interact with certain medications"
 *     responses:
 *       201:
 *         description: Supplement created successfully
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
 *                   example: "Supplement created successfully"
 *                 supplementId:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: Invalid input or missing/invalid fields
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
 *                   example: "Required fields (name, category) missing."
 *       500:
 *         description: Failed to create supplement
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
 *                   example: "Failed to create supplement."
 */
router.post('/supplements', adminController.createSupplement);

/**
 * @swagger
 * /api/admin/supplements/{id}:
 *   get:
 *     summary: Get a supplement by ID (with benefits, warnings, and drug interactions)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Supplement ID
 *     responses:
 *       200:
 *         description: Supplement found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     Id: { type: string, format: uuid }
 *                     Name: { type: string }
 *                     Description: { type: string }
 *                     Category: { type: string }
 *                     Dosage: { type: string }
 *                     DosageInstructions: { type: string }
 *                     Timing: { type: string }
 *                     Status: { type: boolean }
 *                     CreatedAt: { type: string, format: date-time }
 *                     UpdatedAt: { type: string, format: date-time }
 *                     benefits:
 *                       type: array
 *                       items: { type: object, properties: { Description: { type: string } } }
 *                     warnings:
 *                       type: array
 *                       items: { type: object, properties: { Description: { type: string } } }
 *                     drugInteractions:
 *                       type: array
 *                       items: { type: object, properties: { Description: { type: string } } }
 *       400:
 *         description: Supplement ID is required
 *       404:
 *         description: Supplement not found
 *       500:
 *         description: Failed to retrieve supplement
 */
router.get('/supplements/:id', adminController.getSupplement);

/**
 * @swagger
 * /api/admin/supplements/{id}:
 *   put:
 *     summary: Update a supplement by ID (with benefits, warnings, and drug interactions)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Supplement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vitamin D"
 *               description:
 *                 type: string
 *                 example: "Supports bone health and immune function."
 *               category:
 *                 type: string
 *                 example: "Vitamins"
 *               dosage:
 *                 type: string
 *                 example: "1000 IU"
 *               dosageInstructions:
 *                 type: string
 *                 example: "Take with food"
 *               timing:
 *                 type: string
 *                 example: "Morning"
 *               status:
 *                 type: boolean
 *                 example: true
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Supports immune system"
 *               warnings:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Do not exceed recommended dose"
 *               drugInteractions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "May interact with certain medications"
 *     responses:
 *       200:
 *         description: Supplement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Supplement updated successfully" }
 *                 supplementId: { type: string, format: uuid }
 *       400:
 *         description: Invalid input or missing/invalid fields
 *       500:
 *         description: Failed to update supplement
 */
router.put('/supplements/:id', adminController.updateSupplement);

/**
 * @swagger
 * /api/admin/supplements:
 *   get:
 *     summary: Get all supplements (optionally include inactive, filter by category)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, include inactive supplements. Default is false (only active).
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter supplements by category
 *     responses:
 *       200:
 *         description: List of supplements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Id: { type: string, format: uuid }
 *                       Name: { type: string }
 *                       Description: { type: string }
 *                       Category: { type: string }
 *                       Dosage: { type: string }
 *                       DosageInstructions: { type: string }
 *                       Timing: { type: string }
 *                       Status: { type: boolean }
 *                       CreatedAt: { type: string, format: date-time }
 *                       UpdatedAt: { type: string, format: date-time }
 *                       benefits:
 *                         type: array
 *                         items: { type: object, properties: { Description: { type: string } } }
 *                       warnings:
 *                         type: array
 *                         items: { type: object, properties: { Description: { type: string } } }
 *                       drugInteractions:
 *                         type: array
 *                         items: { type: object, properties: { Description: { type: string } } }
 *       500:
 *         description: Failed to retrieve supplements
 */
router.get('/supplements', adminController.getAllSupplements);

/**
 * @swagger
 * /api/admin/supplements/{id}:
 *   delete:
 *     summary: Delete a supplement by ID (with cascade)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Supplement ID
 *     responses:
 *       200:
 *         description: Supplement deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Supplement deleted successfully." }
 *       400:
 *         description: Supplement ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Supplement ID is required." }
 *       404:
 *         description: Supplement not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Supplement not found." }
 *       500:
 *         description: Failed to delete supplement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Failed to delete supplement." }
 */
router.delete('/supplements/:id', adminController.deleteSupplement);

/**
 * @swagger
 * /api/admin/daily-challenges/{id}/assign:
 *   post:
 *     summary: Assign a daily challenge to a new date
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the daily challenge to assign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - NewDate
 *             properties:
 *               NewDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *     responses:
 *       200:
 *         description: Daily challenge assigned to new date successfully
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
 *                     Id:
 *                       type: string
 *                       format: uuid
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
 *                     Date:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Bad request (missing parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Daily challenge not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/daily-challenges/:id/assign', adminController.assignDailyChallenge);

/**
 * @swagger
 * /api/admin/action-plan/assign:
 *   post:
 *     summary: Assign an action plan to multiple users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserIds
 *               - PlanId
 *             properties:
 *               UserIds:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000,987fcdeb-51a2-43d1-b789-123456789abc"
 *                 description: Comma-separated string of user IDs to assign the action plan to
 *               PlanId:
 *                 type: string
 *                 format: uuid
 *                 example: "456e7890-e89b-12d3-a456-426614174000"
 *                 description: The unique identifier of the action plan
 *               StartDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *                 description: Optional start date for the action plan (defaults to today if not provided)
 *               EndDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-21"
 *                 description: Optional end date for the action plan (defaults to 6 days after start date if not provided)
 *     responses:
 *       201:
 *         description: Action plan assigned to users successfully
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
 *                   example: "Action plan assigned to users successfully."
 *                 data:
 *                   type: array
 *                   description: Array of assigned action plan details for each user
 *                   items:
 *                     type: object
 *                     properties:
 *                       UserActionPlanId:
 *                         type: string
 *                         format: uuid
 *                         example: "789e0123-e89b-12d3-a456-426614174000"
 *                         description: The unique identifier of the user action plan assignment
 *                       UserId:
 *                         type: string
 *                         format: uuid
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                         description: The unique identifier of the user
 *                       UserName:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                         description: The username of the user
 *                       PlanId:
 *                         type: string
 *                         format: uuid
 *                         example: "456e7890-e89b-12d3-a456-426614174000"
 *                         description: The unique identifier of the action plan
 *                       PlanTitle:
 *                         type: string
 *                         example: "Daily Exercise Routine"
 *                         description: The title of the action plan
 *                       PlanDescription:
 *                         type: string
 *                         example: "A comprehensive daily exercise routine"
 *                         description: The description of the action plan
 *                       PlanWhyItMatters:
 *                         type: string
 *                         example: "Regular exercise improves health"
 *                         description: Why the action plan matters
 *                       StartDate:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-15"
 *                         description: The start date of the action plan
 *                       EndDate:
 *                         type: string
 *                         format: date
 *                         example: "2024-01-21"
 *                         description: The end date of the action plan
 *                       AssignedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the action plan was assigned
 *                       IsCompleted:
 *                         type: boolean
 *                         example: false
 *                         description: Whether the action plan is completed
 *                       CompletedAt:
 *                         type: string
 *                         format: date-time
 *                         example: null
 *                         description: When the action plan was completed (null if not completed)
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the record was created
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the record was last updated
 *       400:
 *         description: Bad request - missing required fields or invalid data
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
 *                   example: "UserIds and PlanId are required."
 *       404:
 *         description: Action plan not found
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
 *                   example: "Action plan does not exist."
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
 *                   example: "Failed to assign action plan to users."
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.post('/action-plan/assign', adminController.assignActionPlanToUser);

/**
 * @swagger
 * /api/admin/action-plan/goal/assign:
 *   post:
 *     summary: Assign a goal to multiple action plans
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Assigns a goal to multiple action plans simultaneously. The operation:
 *       - Validates that the goal exists
 *       - Validates that all action plans exist
 *       - Skips assignments that already exist (no duplicates)
 *       - Performs all assignments within a transaction
 *       - Returns details of all successful assignments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ActionPlanIds
 *               - GoalId
 *             properties:
 *               ActionPlanIds:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000,987fcdeb-51a2-43d1-b789-123456789abc"
 *                 description: Comma-separated string of action plan IDs to assign the goal to
 *               GoalId:
 *                 type: string
 *                 format: uuid
 *                 example: "456e7890-e89b-12d3-a456-426614174000"
 *                 description: The unique identifier of the goal to assign
 *     responses:
 *       201:
 *         description: Goal assigned to action plans successfully
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
 *                   example: "Goal assigned to action plans successfully."
 *                 data:
 *                   type: array
 *                   description: Array of assigned goal-action plan relationships
 *                   items:
 *                     type: object
 *                     properties:
 *                       ActionPlanGoalId:
 *                         type: string
 *                         format: uuid
 *                         example: "789e0123-e89b-12d3-a456-426614174000"
 *                         description: The unique identifier of the goal-action plan assignment
 *                       ActionPlanId:
 *                         type: string
 *                         format: uuid
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                         description: The unique identifier of the action plan
 *                       GoalId:
 *                         type: string
 *                         format: uuid
 *                         example: "456e7890-e89b-12d3-a456-426614174000"
 *                         description: The unique identifier of the goal
 *                       GoalTitle:
 *                         type: string
 *                         example: "Daily Exercise Routine"
 *                         description: The title of the goal
 *                       GoalDescription:
 *                         type: string
 *                         example: "Establish a consistent daily exercise routine"
 *                         description: The description of the goal
 *                       Category:
 *                         type: string
 *                         example: "Fitness"
 *                         description: The category of the goal
 *                       Frequency:
 *                         type: string
 *                         example: "Daily"
 *                         description: How often the goal should be performed
 *                       VideoContentTitle:
 *                         type: string
 *                         example: "How to Start Exercising"
 *                         description: Title of the associated video content
 *                       VideoContentLnk:
 *                         type: string
 *                         example: "https://example.com/video"
 *                         description: Link to the associated video content
 *                       ActionPlanTitle:
 *                         type: string
 *                         example: "Morning Exercise Routine"
 *                         description: The title of the action plan
 *                       ActionPlanDescription:
 *                         type: string
 *                         example: "A structured morning exercise routine"
 *                         description: The description of the action plan
 *                       ActionPlanWhyItMatters:
 *                         type: string
 *                         example: "Exercise improves overall health and energy"
 *                         description: Why the action plan matters
 *                       AssignedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the goal was assigned to the action plan
 *                       IsCompleted:
 *                         type: boolean
 *                         example: false
 *                         description: Whether the goal-action plan assignment is completed
 *                       CompletedAt:
 *                         type: string
 *                         format: date-time
 *                         example: null
 *                         description: When the goal-action plan assignment was completed (null if not completed)
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the assignment was created
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the assignment was last updated
 *       400:
 *         description: Bad request - missing required fields or invalid data
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
 *                     missingFields:
 *                       value: "ActionPlanIds and GoalId are required."
 *                     invalidFormat:
 *                       value: "ActionPlanIds must be a comma-separated string of action plan IDs."
 *       404:
 *         description: Goal not found
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
 *                   example: "Goal does not exist."
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
 *                   example: "Failed to assign goal to action plans."
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.post('/action-plan/goal/assign', adminController.assignGoalToActionPlan);


/**
 * @swagger
 * /api/admin/ingredients:
 *   post:
 *     summary: Create a new ingredient
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Ingredient
 *               - IngredientCategoryId
 *             properties:
 *               Ingredient:
 *                 type: string
 *                 example: "Garlic"
 *               IngredientCategoryId:
 *                 type: integer
 *                 example: 1
 *               Description:
 *                 type: string
 *                 example: "A pungent bulb used for flavoring"
 *               ImageUrl:
 *                 type: string
 *                 example: "https://example.com/garlic.jpg"
 *               Notes:
 *                 type: string
 *                 example: "High FODMAP in large quantities"
 *               FODMAPLevel:
 *                 type: string
 *                 example: "High"
 *               FODMAPNotes:
 *                 type: string
 *                 example: "Avoid in elimination phase"
 *               FodmapMaxQuantity:
 *                 type: number
 *                 format: float
 *                 example: 0.5
 *               FodmapDetails:
 *                 type: string
 *                 example: "Contains fructans"
 *               Source:
 *                 type: string
 *                 example: "Monash University"
 *               Active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Ingredient created successfully
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
 *                   example: "Ingredient added successfully"
 *                 data:
 *                   type: object
 *                   description: The created ingredient object
 *       400:
 *         description: Invalid input or missing/invalid fields
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
 *                   example: "Ingredient name is required."
 *       409:
 *         description: Ingredient already exists
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
 *                   example: "Ingredient already exists (case-insensitive comparison)."
 *       500:
 *         description: Failed to create ingredient
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
 *                   example: "Failed to add ingredient."
 */
router.post('/ingredients', adminController.addIngredient);

/**
 * @swagger
 * /api/admin/ingredients/{id}:
 *   put:
 *     summary: Update an ingredient by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Ingredient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Ingredient:
 *                 type: string
 *                 example: "Garlic (updated)"
 *               IngredientCategoryId:
 *                 type: integer
 *                 example: 1
 *               Description:
 *                 type: string
 *                 example: "Updated description"
 *               ImageUrl:
 *                 type: string
 *                 example: "https://example.com/new-garlic.jpg"
 *               Notes:
 *                 type: string
 *                 example: "Updated notes"
 *               FODMAPLevel:
 *                 type: string
 *                 example: "Moderate"
 *               FODMAPNotes:
 *                 type: string
 *                 example: "Updated FODMAP notes"
 *               FodmapMaxQuantity:
 *                 type: number
 *                 format: float
 *                 example: 1.0
 *               FodmapDetails:
 *                 type: string
 *                 example: "Updated FODMAP details"
 *               Source:
 *                 type: string
 *                 example: "Updated source"
 *               Active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Ingredient updated successfully
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
 *                   example: "Ingredient updated successfully."
 *       400:
 *         description: Invalid input or missing fields
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
 *                   example: "At least one field to update must be provided."
 *       404:
 *         description: Ingredient not found
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
 *                   example: "Ingredient with provided ID does not exist."
 *       409:
 *         description: Ingredient name conflict
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
 *                   example: "Another ingredient with this name already exists."
 *       500:
 *         description: Failed to update ingredient
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
 *                   example: "Failed to update ingredient."
 */
router.put('/ingredients/:id', adminController.updateIngredient);

/**
 * @swagger
 * /api/admin/ingredients:
 *   get:
 *     summary: Get all ingredients
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all ingredients
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
 *                   example: "Ingredients retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                         example: "Garlic"
 *                       categoryId:
 *                         type: integer
 *                         example: 1
 *                       categoryName:
 *                         type: string
 *                         example: "Vegetables"
 *                       description:
 *                         type: string
 *                         example: "A pungent bulb used for flavoring"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com/garlic.jpg"
 *                       notes:
 *                         type: string
 *                         example: "High FODMAP in large quantities"
 *                       fodmapLevel:
 *                         type: string
 *                         example: "High"
 *                       fodmapNotes:
 *                         type: string
 *                         example: "Avoid in elimination phase"
 *                       fodmapMaxQuantity:
 *                         type: number
 *                         format: float
 *                         example: 0.5
 *                       fodmapDetails:
 *                         type: string
 *                         example: "Contains fructans"
 *                       source:
 *                         type: string
 *                         example: "Monash University"
 *                       active:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No ingredients found
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
 *                   example: "No ingredients found."
 *       500:
 *         description: Failed to retrieve ingredients
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
 *                   example: "Failed to retrieve ingredients."
 */
router.get('/ingredients', adminController.getAllIngredients);

/**
 * @swagger
 * /api/admin/ingredients/{id}:
 *   get:
 *     summary: Get an ingredient by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Ingredient ID
 *     responses:
 *       200:
 *         description: Ingredient details
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
 *                   example: "Ingredient retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                       example: "Garlic"
 *                     categoryId:
 *                       type: integer
 *                       example: 1
 *                     categoryName:
 *                       type: string
 *                       example: "Vegetables"
 *                     description:
 *                       type: string
 *                       example: "A pungent bulb used for flavoring"
 *                     imageUrl:
 *                       type: string
 *                       example: "https://example.com/garlic.jpg"
 *                     notes:
 *                       type: string
 *                       example: "High FODMAP in large quantities"
 *                     fodmapLevel:
 *                       type: string
 *                       example: "High"
 *                     fodmapNotes:
 *                       type: string
 *                       example: "Avoid in elimination phase"
 *                     fodmapMaxQuantity:
 *                       type: number
 *                       format: float
 *                       example: 0.5
 *                     fodmapDetails:
 *                       type: string
 *                       example: "Contains fructans"
 *                     source:
 *                       type: string
 *                       example: "Monash University"
 *                     active:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-10T12:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-12T12:00:00Z"
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Ingredient not found
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
 *                   example: "Ingredient not found"
 *       500:
 *         description: Failed to retrieve ingredient
 */
router.get('/ingredients/:id', adminController.getIngredient);

/**
 * @swagger
 * /api/admin/ingredients/{id}:
 *   delete:
 *     summary: Delete an ingredient by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ingredient ID to delete
 *     responses:
 *       200:
 *         description: Ingredient successfully deleted
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
 *                   example: "Ingredient deleted successfully"
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
 *                   example: "Ingredient ID is required"
 *       404:
 *         description: Ingredient not found
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
 *                   example: "Ingredient not found"
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
 *                   example: "Failed to delete ingredient"
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */

router.delete('/ingredients/:id', adminController.deleteIngredient);

// v2 apis for recipe-------------------------------------------->

/**
 * @swagger
 * /api/admin/recipes/json/v2:
 *   post:
 *     summary: Create a new recipe with instructions and ingredients from JSON (V2)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeCreateV2Request'
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecipeCreateResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RecipeCreateV2Request:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - mealType
 *         - estimatedPrepTime
 *         - estimatedCookTime
 *         - instructions
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "Spaghetti Bolognese"
 *         description:
 *           type: string
 *           minLength: 1
 *           example: "Classic Italian pasta dish with meat sauce"
 *         mealType:
 *           type: string
 *           enum: [Breakfast, Lunch, Dinner, Snack, Dessert]
 *           example: "Dinner"
 *         estimatedPrepTime:
 *           type: integer
 *           minimum: 1
 *           example: 15
 *         estimatedCookTime:
 *           type: integer
 *           minimum: 1
 *           example: 30
 *         imageUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/spaghetti.jpg"
 *         educationalNote:
 *           type: string
 *           nullable: true
 *           example: "Rich in protein and carbohydrates"
 *         loggable:
 *           type: boolean
 *           default: true
 *           example: true
 *         instructions:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/RecipeInstruction'
 *         recipeIngredient:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipeIngredient'
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *             example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 * 
 *     RecipeInstruction:
 *       type: object
 *       required:
 *         - stepOrder
 *         - instruction
 *       properties:
 *         stepOrder:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         instruction:
 *           type: string
 *           minLength: 1
 *           example: "Boil water in a large pot"
 * 
 *     RecipeIngredient:
 *       type: object
 *       required:
 *         - ingredientId
 *         - amount
 *       properties:
 *         ingredientId:
 *           type: string
 *           format: uuid
 *           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         amount:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "200"
 *         unit:
 *           type: string
 *           maxLength: 50
 *           nullable: true
 *           example: "g"
 *         preparationNote:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: "finely chopped"
 *         notes:
 *           type: string
 *           maxLength: 1000
 *           nullable: true
 *           example: "Use fresh if possible"
 *         sortOrder:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 1
 * 
 *     RecipeCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Recipe created successfully"
 *         recipeId:
 *           type: string
 *           format: uuid
 *           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message"
 *         details:
 *           type: string
 *           nullable: true
 *           example: "Additional error details"
 *         invalidIds:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 */

router.post('/recipes/json/v2', adminController.createRecipeWithInstructionsFromJsonV2);

/**
 * @swagger
 * /api/admin/recipes/v2/{id}:
 *   put:
 *     summary: Update a recipe with instructions, ingredients, and tags from JSON (V2)
 *     description: |
 *       Updates a recipe with all its components including instructions, ingredients, and tags.
 *       Partial updates are supported - only fields provided in the JSON will be updated.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - mealType
 *               - estimatedPrepTime
 *               - estimatedCookTime
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "Spaghetti Bolognese"
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 example: "A classic Italian pasta dish."
 *               mealType:
 *                 type: string
 *                 example: "Dinner"
 *               estimatedPrepTime:
 *                 type: integer
 *                 example: 15
 *               estimatedCookTime:
 *                 type: integer
 *                 example: 30
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               educationalNote:
 *                 type: string
 *                 example: "Great source of protein."
 *               loggable:
 *                 type: boolean
 *                 example: true
 *               instructions:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - stepOrder
 *                     - instruction
 *                   properties:
 *                     stepOrder:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *                     instruction:
 *                       type: string
 *                       minLength: 1
 *                       example: "Boil water and cook pasta."
 *               recipeIngredient:
 *                 type: array
 *                 description: "Array of ingredients for the recipe"
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - ingredientId
 *                     - amount
 *                   properties:
 *                     ingredientId:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
 *                     amount:
 *                       type: string
 *                       maxLength: 100
 *                       example: "200g"
 *                     unit:
 *                       type: string
 *                       maxLength: 50
 *                       example: "grams"
 *                     preparationNote:
 *                       type: string
 *                       example: "Finely chopped"
 *                     notes:
 *                       type: string
 *                       example: "Use fresh if possible"
 *                     sortOrder:
 *                       type: integer
 *                       example: 1
 *               tags:
 *                 type: array
 *                 description: "Array of tag UUIDs"
 *                 items:
 *                   type: string
 *                   format: uuid
 *                   example: "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9"
 *     responses:
 *       200:
 *         description: Recipe updated successfully
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
 *                   example: "Recipe updated successfully."
 *                 recipeId:
 *                   type: string
 *                   format: uuid
 *                   example: "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
 *       400:
 *         description: Invalid input or missing/invalid fields
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
 *                   example: "At least one valid instruction is required when provided."
 *                 invalidIngredients:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uuid
 *                 inactiveIngredients:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uuid
 *                 inactiveTags:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uuid
 *       404:
 *         description: Recipe not found
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
 *                   example: "Recipe not found."
 *       500:
 *         description: Internal server error
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
 *                   example: "Failed to update recipe."
 */
router.put('/recipes/v2/:id', adminController.updateRecipeWithInstructionsFromJsonV2);

/**
 * @swagger
 * /api/admin/user-action-plan-narratives:
 *   post:
 *     summary: Create a new user action plan narrative
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserID
 *               - OrderNo
 *               - SummaryText
 *               - DisplayStartDate
 *             properties:
 *               UserID:
 *                 type: string
 *                 format: uuid
 *                 example: "b6e6e7d2-8c3b-4c3e-9e2e-1a2b3c4d5e6f"
 *               OrderNo:
 *                 type: string
 *                 example: "ORD-12345"
 *               SummaryText:
 *                 type: string
 *                 example: "This is a summary for the user's action plan."
 *               DisplayStartDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-15T00:00:00Z"
 *     responses:
 *       201:
 *         description: User action plan narrative created successfully
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
 *                   example: "User action plan narrative created successfully."
 *                 narrativeId:
 *                   type: integer
 *                   example: 123
 *       400:
 *         description: Missing required fields
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
 *                   example: "UserID, OrderNo, SummaryText, and DisplayStartDate are required."
 *       500:
 *         description: Failed to create user action plan narrative
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
 *                   example: "Failed to create user action plan narrative."
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.post('/user-action-plan-narratives', adminController.createUserActionPlanNarrative);

/**
 * @swagger
 * /api/admin/narrative-section:
 *   post:
 *     summary: Create a new narrative section for a user action plan narrative
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - NarrativeID
 *               - SectionOrder
 *               - SectionHeading
 *               - SectionBody
 *             properties:
 *               NarrativeID:
 *                 type: integer
 *                 example: 1
 *               SectionOrder:
 *                 type: integer
 *                 example: 1
 *               SectionHeading:
 *                 type: string
 *                 example: "Introduction"
 *               SectionBody:
 *                 type: string
 *                 example: "This is the body of the section."
 *     responses:
 *       201:
 *         description: Narrative section created successfully
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
 *                   example: "Narrative section created successfully."
 *                 sectionId:
 *                   type: integer
 *                   example: 10
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
 *                   example: "NarrativeID, SectionOrder, SectionHeading, and SectionBody are required."
 *       500:
 *         description: Failed to create narrative section
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
 *                   example: "Failed to create narrative section."
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.post('/narrative-section', adminController.createNarrativeSection);

/**
 * @swagger
 * /api/admin/user-action-plan-narratives/{narrativeId}:
 *   get:
 *     summary: Get a user action plan narrative and its sections by NarrativeID
 *     tags: [Admin]
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
  '/user-action-plan-narratives/:narrativeId',
  adminController.getUserActionPlanNarrativeByNarrativeID
);

/**
 * @swagger
 * /api/admin/user-action-plan-narratives/{narrativeId}:
 *   put:
 *     summary: Update a user action plan narrative
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: narrativeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The NarrativeID of the user action plan narrative to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - SummaryText
 *               - DisplayStartDate
 *             properties:
 *               SummaryText:
 *                 type: string
 *                 example: "Updated summary text for the user's action plan."
 *               DisplayStartDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-06-20T00:00:00Z"
 *     responses:
 *       200:
 *         description: User action plan narrative updated successfully
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
 *                   example: "User action plan narrative updated successfully."
 *       400:
 *         description: NarrativeID, SummaryText, and DisplayStartDate are required
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
 *                   example: "NarrativeID, SummaryText, and DisplayStartDate are required."
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
 *         description: Failed to update user action plan narrative
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
 *                   example: "Failed to update user action plan narrative."
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.put(
  '/user-action-plan-narratives/:narrativeId',
  adminController.updateUserActionPlanNarrative
);

/**
 * @swagger
 * /api/admin/narrative-sections/{sectionId}:
 *   delete:
 *     summary: Delete a narrative section
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The SectionID of the narrative section to delete
 *     responses:
 *       200:
 *         description: Narrative section deleted successfully
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
 *                   example: "Narrative section deleted successfully."
 *       400:
 *         description: SectionID is required
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
 *                   example: "SectionID is required."
 *       404:
 *         description: Narrative section not found
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
 *                   example: "Narrative section not found."
 *       500:
 *         description: Failed to delete narrative section
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
 *                   example: "Failed to delete narrative section."
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.delete(
  '/narrative-sections/:sectionId',
  adminController.deleteNarrativeSection
);

/**
 * @swagger
 * /api/admin/narrative-sections/{sectionId}:
 *   put:
 *     summary: Update a narrative section
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The SectionID of the narrative section to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NarrativeID:
 *                 type: integer
 *                 minimum: 1
 *                 description: The ID of the narrative this section belongs to
 *                 example: 1
 *               SectionOrder:
 *                 type: integer
 *                 minimum: 1
 *                 description: The order/sequence of this section within the narrative
 *                 example: 2
 *               SectionHeading:
 *                 type: string
 *                 maxLength: 455
 *                 description: The heading/title of the section
 *                 example: "Updated Section Heading"
 *               SectionBody:
 *                 type: string
 *                 description: The main content/body of the section
 *                 example: "This is the updated content of the narrative section."
 *     responses:
 *       200:
 *         description: Narrative section updated successfully
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
 *                   example: "Narrative section updated successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     SectionID:
 *                       type: integer
 *                       example: 10
 *                     NarrativeID:
 *                       type: integer
 *                       example: 1
 *                     SectionOrder:
 *                       type: integer
 *                       example: 2
 *                     SectionHeading:
 *                       type: string
 *                       example: "Updated Section Heading"
 *                     SectionBody:
 *                       type: string
 *                       example: "This is the updated content of the narrative section."
 *                     CreatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-10T12:00:00Z"
 *                     UpdatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-12T12:00:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "SectionID is required and must be a valid integer."
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "At least one field to update must be provided."
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "SectionHeading must be a non-empty string."
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: false
 *                     message:
 *                       type: string
 *                       example: "Invalid NarrativeID provided. The narrative does not exist."
 *       404:
 *         description: Narrative section not found
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
 *                   example: "Narrative section not found."
 *       500:
 *         description: Failed to update narrative section
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
 *                   example: "Failed to update narrative section."
 *                 error:
 *                   type: string
 *                   example: "Detailed error message"
 */
router.put(
  '/narrative-sections/:sectionId',
  adminController.updateNarrativeSection
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieve a list of users with pagination
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: PageNumber
 *         schema:
 *           type: integer
 *         description: The page number to retrieve
 *       - in: query
 *         name: PageSize
 *         schema:
 *           type: integer
 *         description: The number of users per page
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       500:
 *         description: Failed to fetch users
 */

// Route to get all users with pagination
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{userId}/narratives:
 *   get:
 *     summary: Retrieve user action plan narratives by UserID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of user action plan narratives
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
 *                       NarrativeID:
 *                         type: string
 *                       OrderNo:
 *                         type: string
 *                       SummaryText:
 *                         type: string
 *                       DisplayStartDate:
 *                         type: string
 *                         format: date-time
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No narratives found for the given UserID
 *       500:
 *         description: Failed to fetch narratives
 */
router.get('/users/:userId/narratives', adminController.getUserActionPlanNarrativesByUserID);

/**
 * @swagger
 * /api/admin/action-plans:
 *   post:
 *     summary: Create a new action plan
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *               - Description
 *             properties:
 *               Title:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Daily Exercise Routine"
 *                 description: The title of the action plan
 *               Description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "A comprehensive daily exercise routine to improve fitness and health"
 *                 description: Detailed description of the action plan
 *               WhyItMatters:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Regular exercise helps maintain physical and mental health"
 *                 description: Explanation of why this action plan matters
 *     responses:
 *       201:
 *         description: Action plan created successfully
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
 *                   example: "Action plan created successfully"
 *                 data:
 *                   type: object
 *                   description: The created action plan details
 *       400:
 *         description: Bad request - missing required fields
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
 *                   example: "Action plan title is required."
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
 *                   example: "Failed to create action plan"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.post('/action-plans', adminController.createActionPlan);

/**
 * @swagger
 * /api/admin/action-plans/{id}:
 *   put:
 *     summary: Update an existing action plan
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the action plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Updated Daily Exercise Routine"
 *                 description: The updated title of the action plan
 *               Description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "An updated comprehensive daily exercise routine"
 *                 description: Updated description of the action plan
 *               WhyItMatters:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Regular exercise is essential for maintaining optimal health"
 *                 description: Updated explanation of why this action plan matters
 *     responses:
 *       200:
 *         description: Action plan updated successfully
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
 *                   example: "Action plan updated successfully"
 *                 data:
 *                   type: object
 *                   description: The updated action plan details
 *       400:
 *         description: Bad request - missing action plan ID
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
 *                   example: "Action plan ID is required."
 *       404:
 *         description: Action plan not found
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
 *                   example: "Action plan not found."
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
 *                   example: "Failed to update action plan"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.put('/action-plans/:id', adminController.updateActionPlan);

/**
 * @swagger
 * /api/admin/action-plans:
 *   get:
 *     summary: Get all action plans with assigned users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *                 message:
 *                   type: string
 *                   example: "Action plans retrieved successfully"
 *                 data:
 *                   type: array
 *                   description: Array of action plans with their assigned users
 *                   items:
 *                     type: object
 *                     properties:
 *                       ActionPlanId:
 *                         type: string
 *                         format: uuid
 *                         example: "456e7890-e89b-12d3-a456-426614174000"
 *                         description: The unique identifier of the action plan
 *                       Title:
 *                         type: string
 *                         example: "Daily Exercise Routine"
 *                         description: The title of the action plan
 *                       Description:
 *                         type: string
 *                         example: "A comprehensive daily exercise routine"
 *                         description: The description of the action plan
 *                       WhyItMatters:
 *                         type: string
 *                         example: "Regular exercise improves health"
 *                         description: Why the action plan matters
 *                       CreatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the action plan was created
 *                       UpdatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                         description: When the action plan was last updated
 *                       Users:
 *                         type: array
 *                         description: Array of users assigned to this action plan
 *                         items:
 *                           type: object
 *                           properties:
 *                             UserId:
 *                               type: string
 *                               format: uuid
 *                               example: "123e4567-e89b-12d3-a456-426614174000"
 *                               description: The unique identifier of the user
 *                             UserName:
 *                               type: string
 *                               example: "john.doe@example.com"
 *                               description: The username of the user
 *                             StartDate:
 *                               type: string
 *                               format: date
 *                               example: "2024-01-15"
 *                               description: The start date of the user's assignment
 *                             EndDate:
 *                               type: string
 *                               format: date
 *                               example: "2024-01-21"
 *                               description: The end date of the user's assignment
 *                             AssignedAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2024-01-15T10:30:00Z"
 *                               description: When the action plan was assigned to the user
 *                             IsCompleted:
 *                               type: boolean
 *                               example: false
 *                               description: Whether the user has completed the action plan
 *                             CompletedAt:
 *                               type: string
 *                               format: date-time
 *                               example: null
 *                               description: When the user completed the action plan (null if not completed)
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
 *                   example: "Failed to retrieve action plans"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.get('/action-plans', adminController.getAllActionPlans);

/**
 * @swagger
 * /api/admin/action-plans/{id}:
 *   delete:
 *     summary: Delete an action plan and all associated records
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Deletes an action plan and all its associated records including:
 *       - ActionPlanGoals (if table exists)
 *       - UserActionPlanV2 assignments (if table exists)
 *       - The action plan itself
 *       
 *       This operation is performed within a transaction to ensure data integrity.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the action plan to delete
 *     responses:
 *       200:
 *         description: Action plan and associated records deleted successfully
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
 *                   example: "Action plan and associated records deleted successfully."
 *       400:
 *         description: Bad request - missing action plan ID
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
 *                   example: "Action plan ID is required."
 *       404:
 *         description: Action plan not found
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
 *                   example: "Action plan not found."
 *       409:
 *         description: Cannot delete action plan - it is being referenced by other records
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
 *                   example: "Cannot delete action plan - it is being referenced by other records."
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
 *                   example: "Failed to delete action plan"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.delete('/action-plans/:id', adminController.deleteActionPlan);

/**
 * @swagger
 * /api/admin/diet-plan-templates:
 *   post:
 *     summary: Create a new diet plan template
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TemplateName
 *             properties:
 *               TemplateName:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Keto Diet Plan"
 *                 description: The name of the diet plan template
 *               Description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "A comprehensive ketogenic diet plan for weight loss and improved health"
 *                 description: Detailed description of the diet plan template
 *     responses:
 *       201:
 *         description: Diet plan template created successfully
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
 *                   example: "Diet plan template created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     DietPlanTemplateId:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     Name:
 *                       type: string
 *                       example: "Keto Diet Plan"
 *                     Description:
 *                       type: string
 *                       example: "A comprehensive ketogenic diet plan for weight loss and improved health"
 *       400:
 *         description: Bad request - missing required fields
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
 *                   example: "TemplateName is required."
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
 *                   example: "Failed to create diet plan template"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.post('/diet-plan-templates', adminController.createDietPlanTemplate);

/**
 * @swagger
 * /api/admin/diet-plan-templates:
 *   get:
 *     summary: Get all diet plan templates
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Diet plan templates retrieved successfully
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
 *                   example: "Diet plan templates retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Diet plan template object
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
 *                   example: "Failed to retrieve diet plan templates"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.get('/diet-plan-templates', adminController.getAllDietPlanTemplates);

/**
 * @swagger
 * /api/admin/diet-plan-templates/{id}:
 *   put:
 *     summary: Update an existing diet plan template
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the diet plan template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TemplateName
 *             properties:
 *               TemplateName:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Updated Keto Diet Plan"
 *                 description: The updated name of the diet plan template
 *               Description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "An updated comprehensive ketogenic diet plan"
 *                 description: Updated description of the diet plan template
 *     responses:
 *       200:
 *         description: Diet plan template updated successfully
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
 *                   example: "Diet plan template updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     DietPlanTemplateId:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     Name:
 *                       type: string
 *                       example: "Updated Keto Diet Plan"
 *                     Description:
 *                       type: string
 *                       example: "An updated comprehensive ketogenic diet plan"
 *       400:
 *         description: Bad request - missing required fields
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
 *                   example: "DietPlanTemplateId is required."
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
 *                   example: "Failed to update diet plan template"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.put('/diet-plan-templates/:id', adminController.updateDietPlanTemplate);

/**
 * @swagger
 * /api/admin/diet-plan-templates/{id}:
 *   delete:
 *     summary: Delete a diet plan template
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the diet plan template to delete
 *     responses:
 *       200:
 *         description: Diet plan template deleted successfully
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
 *                   example: "Diet plan template deleted successfully."
 *       400:
 *         description: Bad request - missing diet plan template ID
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
 *                   example: "DietPlanTemplateId is required."
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
 *                   example: "Failed to delete diet plan template"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.delete('/diet-plan-templates/:id', adminController.deleteDietPlanTemplate);

/**
 * @swagger
 * /api/admin/diet-plan-templates/recipes:
 *   post:
 *     summary: Add a recipe to a diet plan template
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - DietPlanTemplateId
 *               - RecipeId
 *               - WeekNumber
 *               - DayOfWeek
 *             properties:
 *               DietPlanTemplateId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: The unique identifier of the diet plan template
 *               RecipeId:
 *                 type: string
 *                 format: uuid
 *                 example: "987fcdeb-51a2-43d1-b789-123456789abc"
 *                 description: The unique identifier of the recipe to add
 *               WeekNumber:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *                 description: The week number (1, 2, 3, 4, etc.)
 *               DayOfWeek:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 7
 *                 example: 1
 *                 description: The day of the week (1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday, 5=Thursday, 6=Friday, 7=Saturday)
 *     responses:
 *       201:
 *         description: Recipe added to diet plan template successfully
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
 *                   example: "Recipe added to diet plan template successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     DietPlanTemplateId:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     RecipeId:
 *                       type: string
 *                       format: uuid
 *                       example: "987fcdeb-51a2-43d1-b789-123456789abc"
 *                     WeekNumber:
 *                       type: integer
 *                       example: 1
 *                     DayOfWeek:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Bad request - missing or invalid required fields
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
 *                   example: "DietPlanTemplateId is required."
 *       404:
 *         description: Diet plan template or recipe not found
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
 *                   example: "Diet plan template not found."
 *       409:
 *         description: Conflict - recipe already assigned to this meal slot
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
 *                   example: "A recipe is already assigned to this meal slot in the template."
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
 *                   example: "Failed to add recipe to diet plan template"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.post('/diet-plan-templates/recipes', adminController.addRecipeToTemplate);

/**
 * @swagger
 * /api/admin/diet-plan-templates/assign:
 *   post:
 *     summary: Assign a diet plan template to a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserId
 *               - DietPlanTemplateId
 *               - StartDate
 *               - EndDate
 *             properties:
 *               UserId:
 *                 oneOf:
 *                   - type: string
 *                     format: uuid
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                     description: Single user ID
 *                   - type: array
 *                     items:
 *                       type: string
 *                       format: uuid
 *                     example: ["123e4567-e89b-12d3-a456-426614174000", "456e7890-e89b-12d3-a456-426614174000"]
 *                     description: Array of user IDs to assign the diet plan to
 *                   - type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000,456e7890-e89b-12d3-a456-426614174000"
 *                     description: Comma-separated string of user IDs
 *               DietPlanTemplateId:
 *                 type: string
 *                 format: uuid
 *                 example: "987fcdeb-51a2-43d1-b789-123456789abc"
 *                 description: The unique identifier of the diet plan template to assign
 *               StartDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *                 description: The start date for the user's diet plan (YYYY-MM-DD format)
 *               EndDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-15"
 *                 description: The end date for the user's diet plan (YYYY-MM-DD format). Must be after StartDate.
 *               IsActive:
 *                 type: boolean
 *                 example: true
 *                 description: Whether the diet plan assignment is active (defaults to true if not provided)
 *     responses:
 *       201:
 *         description: Diet plan template assigned to user(s) successfully
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
 *                   example: "Diet plan template assigned to 2 user(s) successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     successfulAssignments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           UserId:
 *                             type: string
 *                             format: uuid
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                             description: The user ID that was successfully assigned
 *                           MemberDietPlanId:
 *                             type: string
 *                             format: uuid
 *                             example: "456e7890-e89b-12d3-a456-426614174000"
 *                             description: The unique identifier of the created member diet plan
 *                           Weeks:
 *                             type: integer
 *                             example: 4
 *                             description: Number of weeks in the diet plan
 *                           TotalDays:
 *                             type: integer
 *                             example: 28
 *                             description: Total number of days in the diet plan
 *                           StartDate:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-15"
 *                             description: The start date of the diet plan
 *                           EndDate:
 *                             type: string
 *                             format: date
 *                             example: "2024-02-15"
 *                             description: The end date of the diet plan
 *                           IsActive:
 *                             type: boolean
 *                             example: true
 *                             description: Whether the diet plan assignment is active
 *                           success:
 *                             type: boolean
 *                             example: true
 *                             description: Indicates successful assignment for this user
 *                     failedAssignments:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Template already assigned to user: 456e7890-e89b-12d3-a456-426614174000"]
 *                       description: Array of error messages for failed assignments (only present if there are failures)
 *       400:
 *         description: Bad request - missing required fields or invalid data
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
 *       409:
 *         description: Conflict - template already assigned to user(s)
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
 *                   example: "Failed to assign diet plan template to any users"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Template already assigned to user: 123e4567-e89b-12d3-a456-426614174000"]
 *                   description: Array of specific error messages for each failed assignment
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
 *                   example: "Failed to assign diet plan template to user"
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.post('/diet-plan-templates/assign', adminController.assignTemplateToUser);

/**
 * @swagger
 * /api/admin/goals/{id}:
 *   delete:
 *     summary: Delete a goal and all associated data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Deletes a goal and all its associated records including:
 *       - GoalInstructions (step-by-step instructions)
 *       - GoalBenefits (benefits of achieving the goal)
 *       - ActionPlanGoals (mapping to action plans)
 *       - The goal itself
 *       
 *       This operation is performed within a transaction to ensure data integrity.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the goal to delete
 *     responses:
 *       200:
 *         description: Goal and all associated data deleted successfully
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
 *                   example: "Goal and all associated data deleted successfully."
 *       400:
 *         description: Bad request - missing goal ID
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
 *                   example: "Goal ID is required."
 *       404:
 *         description: Goal not found
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
 *                   example: "Goal not found."
 *       409:
 *         description: Cannot delete goal - it is being referenced by other records
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
 *                   example: "Cannot delete goal - it is being referenced by other records."
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
 *                   example: "Failed to delete goal."
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 */
router.delete('/goals/:id', adminController.deleteGoal);

module.exports = router;
