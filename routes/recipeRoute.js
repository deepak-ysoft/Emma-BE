const express = require("express");
const authenticateToken = require("../middleware/authenticate");
const recipeController = require("../controllers/recipeController");
const multer = require("multer");
const upload = multer();

const router = express.Router();

/**
 * @swagger
 * /api/recipes/analyze:
 *   post:
 *     summary: Analyze a recipe image and extract ingredients
 *     tags: [Recipes]
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
 *               diet_type:
 *                 type: string
 *                 example: "fodmap"
 *     responses:
 *       200:
 *         description: Food analyzed successfully
 *       400:
 *         description: No image provided
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/analyze",
  authenticateToken,
  upload.single("file"),
  recipeController.analyzeRecipe
);

/**
 * @swagger
 * /api/recipes/details/{id}:
 *   get:
 *     summary: Get recipe details by classification ID
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Classification ID
 *     responses:
 *       200:
 *         description: Recipe details retrieved successfully
 *       400:
 *         description: Missing classification ID
 *       404:
 *         description: Classification not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/details/:id",
  authenticateToken,
  recipeController.getRecipeDetailsById
);

/**
 * @swagger
 * /api/recipes/extractedIngredient:
 *   post:
 *     summary: Add or update an extracted ingredient
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ExtractedIngredientId:
 *                 type: integer
 *                 nullable: true
 *                 example: 12
 *               classificationId:
 *                 type: integer
 *                 example: 101
 *               IngredientName:
 *                 type: string
 *                 example: "Tomato"
 *               quantity:
 *                 type: string
 *                 example: "2 tbsp"
 *     responses:
 *       200:
 *         description: Ingredient added or updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  "/extractedIngredient",
  authenticateToken,
  recipeController.extractedIngredient
);

module.exports = router;
