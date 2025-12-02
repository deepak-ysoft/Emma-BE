const axios = require("axios");
const FormData = require("form-data");
const { getUserById } = require("../helpers/userHelper");
const response = require("../common/response");
const { connectToDatabase } = require("../config/config");
const sql = require("mssql");
const { uploadFile } = require("../middleware/blobStorage");
require("dotenv").config();

exports.analyzeRecipe = async (req, res) => {
  const userId = req.user.userId;
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, "User not found");
  }
  try {
    let blobUrl = null;
    const file = req.file;
    if (file) {
      console.log("File received for upload:", file.originalname);
      blobUrl = await uploadFile(file.originalname, file.buffer, file.mimetype);
    } else {
      return response.ValidationError(res, "No image provided");
    }
    const formData = new FormData();
    formData.append("emmaUserId", userId);
    formData.append("diet_type", "fodmap");
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Call the external API
    const resData = await axios.post(
      process.env.CLASSIFY_DIET_FROM_IMG_API,
      formData,
      {
        headers: {
          Authorization:
            "Bearer i0OF2HPM2rz];.c9e:+frB;XuuBOw\\GKhP|@';!+d-ht#9-Vy0\\]U5UO(,##;",
          ...formData.getHeaders(),
        },
      }
    );

    const data = resData?.data;
    const pool = await connectToDatabase();
    const updatedClassification = {
      ...data.classification,
      meal_components: data.classification.meal_components.map((comp) => ({
        ...comp,
        quantity: "2 tbsp",
      })),
    };
    const ingredientsJson = JSON.stringify(data.ingredients_extracted);
    const classificationJson = JSON.stringify(updatedClassification);
    const approved = data.classification.decision.approved ? 1 : 0;
    const decisionReason = data.classification.decision.reason || "";
    const detailedAnalysis = data.classification.detailed_analysis || "";
    const totalIngredients = data.classification.scoring.total_ingredients || 0;
    const approvedIngredients =
      data.classification.scoring.approved_ingredients || 0;
    const scorePercent = data.classification.scoring.score_percent || 0;

    const request = pool.request();
    request.input("EmmaUserId", sql.NVarChar(50), data.emmaUserId);
    request.input("DietType", sql.NVarChar(50), data.diet_type);
    request.input("IsFood", sql.Bit, data.is_food);
    request.input(
      "IngredientsExtractedJson",
      sql.NVarChar(sql.MAX),
      ingredientsJson
    );
    request.input(
      "ClassificationJson",
      sql.NVarChar(sql.MAX),
      classificationJson
    );
    request.input("Approved", sql.Bit, approved);
    request.input("DecisionReason", sql.NVarChar(sql.MAX), decisionReason);
    request.input("DetailedAnalysis", sql.NVarChar(sql.MAX), detailedAnalysis);
    request.input("TotalIngredients", sql.Int, totalIngredients);
    request.input("ApprovedIngredients", sql.Int, approvedIngredients);
    request.input("ScorePercent", sql.Decimal(5, 2), scorePercent);
    request.input("BlobImageUrl", sql.NVarChar(sql.MAX), blobUrl);

    const result = await request.execute("InsertFODMAPClassification");
    const classificationId = result.recordsets[5]?.[0]?.ClassificationId;

    return response.SuccessResponseWithData(res, "Food analyzed successfully", {
      classificationId: classificationId,
    });
  } catch (error) {
    return response.FailedResponseWithOutData(
      res,
      error.response?.data || error.message
    );
  }
};

exports.getRecipeDetailsById = async (req, res) => {
  const classificationId = req.params.id;
  if (!classificationId) {
    return response.ValidationError(res, "classification id is required");
  }
  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    request.input("ClassificationId", sql.Int, classificationId);
    const result = await request.execute("GetFODMAPClassificationChunked");
    const recordsets = result.recordsets;

    // Validate we have the base data
    if (recordsets[0].length === 0) {
      throw new Error(`Classification with ID ${classificationId} not found`);
    }

    const baseData = recordsets[0][0];
    const ingredients = recordsets[1] || [];
    const mealComponents = recordsets[2] || [];
    const fodmapComponents = recordsets[3] || [];

    // Validate required fields
    if (!baseData.EmmaUserId) {
      throw new Error("Missing EmmaUserId in base data");
    }
    // Build FODMAP components lookup
    const fodmapLookup = {};
    fodmapComponents.forEach((fc) => {
      const key = `${fc.MealComponentId}_${fc.ComponentName}`;
      fodmapLookup[key] = {
        isPresent: Boolean(fc.IsPresent),
        source: fc.Source,
      };
    });

    // Reconstruct meal components
    const reconstructedMealComponents = mealComponents.map((mc) => {
      console.log(mc);
      const contains = {};
      // Get all FODMAP components for this meal component
      Object.keys(fodmapLookup)
        .filter((key) => key.startsWith(`${mc.MealComponentId}_`))
        .forEach((key) => {
          const componentName = key.split("_")[1];
          contains[componentName] = {
            present: fodmapLookup[key].isPresent,
            source: fodmapLookup[key].source,
          };
        });

      return {
        item: mc.Item,
        id: mc.MealComponentId,
        quantity: mc.Quantity,
        contains: contains,
      };
    });
    // // Construct the final object
    const data = {
      diet_type: baseData.DietType || "fodmap",
      is_food: Boolean(baseData.IsFood),
      mealImage: baseData.BlobImageUrl || "",
      ingredients_extracted: ingredients.map((ing) => ing),
      classification: {
        meal_components: reconstructedMealComponents,
        decision: {
          approved: Boolean(baseData.Approved),
          reason: baseData.DecisionReason || "",
        },
        detailed_analysis: baseData.DetailedAnalysis || "",
        scoring: {
          total_ingredients: baseData.TotalIngredients || 0,
          approved_ingredients: baseData.ApprovedIngredients || 0,
          score_percent: parseFloat(baseData.ScorePercent) || 0,
        },
      },
    };
    return response.SuccessResponseWithData(res, "Recipe details", data);
  } catch (error) {
    return response.FailedResponseWithOutData(
      res,
      error.response?.data || error.message
    );
  }
};

exports.extractedIngredient = async (req, res) => {
  const userId = req.user.userId;
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, "User not found");
  }
  const { ExtractedIngredientId, classificationId, IngredientName, quantity } =
    req.body;
  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    request.input("MealComponentId", sql.Int, ExtractedIngredientId || null);
    request.input("ClassificationId", sql.Int, classificationId);
    request.input("ComponentItem", sql.NVarChar(400), IngredientName);
    request.input("Quantity", sql.NVarChar(400), quantity);
    const result = await request.execute(
      "InsertOrUpdateMealComponentAndIngredient"
    );
    response.SuccessResponseWithData(
      res,
      result.recordset[0]?.OperationStatus === "Inserted"
        ? "Ingredient added successfully"
        : "Ingredient updated successfully",
      result.recordset[0]
    );
  } catch (error) {
    return response.FailedResponseWithOutData(
      res,
      error.response?.data || error.message
    );
  }
};
