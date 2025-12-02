const { connectToDatabase } = require('../config/config');
const sql = require('mssql');
const { uploadFile } = require('../middleware/blobStorage'); // Import blob upload

// Create a new tag
exports.createTag = async (req, res) => {
  const { Name, Description, Status } = req.body;

  // Validate input
  if (!Name || typeof Name !== 'string' || Name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Tag name is required.' });
  }
  if (Status && !['Active', 'Inactive'].includes(Status)) {
    return res.status(400).json({ success: false, message: 'Status must be either Active or Inactive.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Name', sql.NVarChar(100), Name)
      .input('Description', sql.NVarChar(500), Description || null)
      .input('Status', sql.NVarChar(20), Status || 'Active')
      .execute('CreateTag');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Tag created successfully', data: result.recordset[0] });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create tag' });
    }
  } catch (err) {
    if (err.number === 50020) {
      return res.status(400).json({ success: false, message: 'Tag name is required.' });
    }
    if (err.number === 50021) {
      return res.status(400).json({ success: false, message: 'Status must be either Active or Inactive.' });
    }
    if (err.number === 50022) {
      return res.status(409).json({ success: false, message: 'A tag with this name already exists.' });
    }
    console.error('Error creating tag:', err);
    return res.status(500).json({ success: false, message: 'Failed to create tag', error: err.message });
  }
};

// Update an existing tag
exports.updateTag = async (req, res) => {
  const { id } = req.params;
  const { Name, Description, Status } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Tag ID is required.' });
  }
  if (Status && !['Active', 'Inactive'].includes(Status)) {
    return res.status(400).json({ success: false, message: 'Status must be either Active or Inactive.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .input('Name', sql.NVarChar(100), Name || null)
      .input('Description', sql.NVarChar(500), Description || null)
      .input('Status', sql.NVarChar(20), Status || null)
      .execute('UpdateTag');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Tag updated successfully', data: result.recordset[0] });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to update tag' });
    }
  } catch (err) {
    if (err.number === 50030) {
      return res.status(400).json({ success: false, message: 'Tag ID is required.' });
    }
    if (err.number === 50031) {
      return res.status(400).json({ success: false, message: 'Status must be either Active or Inactive.' });
    }
    if (err.number === 50032) {
      return res.status(404).json({ success: false, message: 'Tag not found.' });
    }
    if (err.number === 50033) {
      return res.status(409).json({ success: false, message: 'A tag with this name already exists.' });
    }
    console.error('Error updating tag:', err);
    return res.status(500).json({ success: false, message: 'Failed to update tag', error: err.message });
  }
};

// Get all tags (optionally filtered by status)
exports.getAllTags = async (req, res) => {
  const { Status } = req.query;
  if (Status && !['Active', 'Inactive'].includes(Status)) {
    return res.status(400).json({ success: false, message: 'Status must be either Active, Inactive, or NULL.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Status', sql.NVarChar(20), Status || null)
      .execute('GetAllTags');
    return res.status(200).json({ success: true, message: 'Tags retrieved successfully', data: result.recordset });
  } catch (err) {
    if (err.number === 50040) {
      return res.status(400).json({ success: false, message: 'Status must be either Active, Inactive, or NULL.' });
    }
    console.error('Error retrieving tags:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve tags', error: err.message });
  }
};

// Delete a tag
exports.deleteTag = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Tag ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .execute('DeleteTag');
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Result === 'Success') {
      return res.status(200).json({ success: true, message: result.recordset[0].Message });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to delete tag' });
    }
  } catch (err) {
    if (err.number === 50060) {
      return res.status(400).json({ success: false, message: 'Tag ID is required.' });
    }
    if (err.number === 50061) {
      return res.status(404).json({ success: false, message: 'Tag not found.' });
    }
    if (err.number === 50062) {
      return res.status(409).json({ success: false, message: 'Cannot delete tag because it is referenced by other records.' });
    }
    console.error('Error deleting tag:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete tag', error: err.message });
  }
};

// Create a new learning video
exports.createLearningVideo = async (req, res) => {
  let {
    Title,
    TitleThumbnailUrl,
    Description,
    Category,
    Duration,
    PublicationDate,
    ViewCount,
    Instructor,
    Status,
    TagId
  } = req.body;

  // Handle VideoUrl: either from body or file upload
  let VideoUrl = req.body.VideoUrl;
  if (req.file && req.file.fieldname === 'video') {
    try {
      VideoUrl = await uploadFile(req.file.originalname, req.file.buffer, req.file.mimetype);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to upload video file', error: err.message });
    }
  }

  // Handle TitleThumbnailUrl: either from body or file upload (thumbnail)
  let thumbnailUrl = TitleThumbnailUrl;
  if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
    try {
      const thumbFile = req.files['thumbnail'][0];
      thumbnailUrl = await uploadFile(thumbFile.originalname, thumbFile.buffer, thumbFile.mimetype);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to upload thumbnail file', error: err.message });
    }
  }

  // Validate required fields
  if (!Title || typeof Title !== 'string' || Title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Title is required.' });
  }
  if (!VideoUrl || typeof VideoUrl !== 'string' || VideoUrl.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'VideoUrl is required.' });
  }
  if (Status && !['Active', 'Inactive', 'Draft'].includes(Status)) {
    return res.status(400).json({ success: false, message: 'Status must be Active, Inactive, or Draft.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Title', sql.NVarChar(255), Title)
      .input('TitleThumbnailUrl', sql.NVarChar(sql.MAX), thumbnailUrl || null)
      .input('Description', sql.NVarChar(sql.MAX), Description || null)
      .input('Category', sql.NVarChar(100), Category || null)
      .input('Duration', sql.Int, Duration || null)
      .input('PublicationDate', sql.DateTime, PublicationDate || null)
      .input('ViewCount', sql.Int, ViewCount || 0)
      .input('VideoUrl', sql.NVarChar(sql.MAX), VideoUrl)
      .input('Instructor', sql.NVarChar(100), Instructor || null)
      .input('Status', sql.NVarChar(50), Status || 'Active')
      .input('TagId', sql.UniqueIdentifier, TagId || null)
      .execute('CreateLearningVideo');

    // Return the created video as recordset
    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Learning video created successfully', data: result.recordset[0] });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create learning video' });
    }
  } catch (err) {
    if (err.number === 50030) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    if (err.number === 50031) {
      return res.status(400).json({ success: false, message: 'VideoUrl is required.' });
    }
    if (err.number === 50032) {
      return res.status(400).json({ success: false, message: 'Status must be Active, Inactive, or Draft.' });
    }
    if (err.number === 50033) {
      return res.status(400).json({ success: false, message: 'The specified TagID does not exist.' });
    }
    if (err.number === 50034) {
      return res.status(409).json({ success: false, message: 'A video with this title already exists.' });
    }
    if (err.number === 50035) {
      return res.status(409).json({ success: false, message: 'A video with this URL already exists.' });
    }
    console.error('Error creating learning video:', err);
    return res.status(500).json({ success: false, message: 'Failed to create learning video', error: err.message });
  }
};

// Update an existing learning video
exports.updateLearningVideo = async (req, res) => {
  const { id } = req.params;
  let {
    Title,
    TitleThumbnailUrl,
    Description,
    Category,
    Duration,
    PublicationDate,
    ViewCount,
    Instructor,
    Status,
    TagId
  } = req.body;

  // Handle VideoUrl: either from body or file upload
  let VideoUrl = req.body.VideoUrl;
  if (req.file && req.file.fieldname === 'video') {
    try {
      VideoUrl = await uploadFile(req.file.originalname, req.file.buffer, req.file.mimetype);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to upload video file', error: err.message });
    }
  }

  // Handle TitleThumbnailUrl: either from body or file upload (thumbnail)
  let thumbnailUrl = TitleThumbnailUrl;
  if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
    try {
      const thumbFile = req.files['thumbnail'][0];
      thumbnailUrl = await uploadFile(thumbFile.originalname, thumbFile.buffer, thumbFile.mimetype);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to upload thumbnail file', error: err.message });
    }
  }

  if (!id) {
    return res.status(400).json({ success: false, message: 'Video ID is required.' });
  }
  if (Status && !['Active', 'Inactive', 'Draft'].includes(Status)) {
    return res.status(400).json({ success: false, message: 'Status must be Active, Inactive, or Draft.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .input('Title', sql.NVarChar(255), Title || null)
      .input('TitleThumbnailUrl', sql.NVarChar(sql.MAX), thumbnailUrl || null)
      .input('Description', sql.NVarChar(sql.MAX), Description || null)
      .input('Category', sql.NVarChar(100), Category || null)
      .input('Duration', sql.Int, Duration || null)
      .input('PublicationDate', sql.DateTime, PublicationDate || null)
      .input('ViewCount', sql.Int, ViewCount || null)
      .input('VideoUrl', sql.NVarChar(sql.MAX), VideoUrl || null)
      .input('Instructor', sql.NVarChar(100), Instructor || null)
      .input('Status', sql.NVarChar(50), Status || null)
      .input('TagId', sql.UniqueIdentifier, TagId || null)
      .execute('UpdateLearningVideo');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Learning video updated successfully', data: result.recordset[0] });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to update learning video' });
    }
  } catch (err) {
    if (err.number === 50036) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }
    if (err.number === 50032) {
      return res.status(400).json({ success: false, message: 'Status must be Active, Inactive, or Draft.' });
    }
    if (err.number === 50033) {
      return res.status(400).json({ success: false, message: 'The specified TagID does not exist.' });
    }
    if (err.number === 50034) {
      return res.status(409).json({ success: false, message: 'A video with this title already exists.' });
    }
    if (err.number === 50035) {
      return res.status(409).json({ success: false, message: 'A video with this URL already exists.' });
    }
    console.error('Error updating learning video:', err);
    return res.status(500).json({ success: false, message: 'Failed to update learning video', error: err.message });
  }
};

// Get learning video(s) by Id, TagId, or all
exports.getLearningVideo = async (req, res) => {
  const { id } = req.params;
  const { TagId } = req.query;

  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    if (id) {
      request.input('Id', sql.UniqueIdentifier, id);
    } else {
      request.input('Id', sql.UniqueIdentifier, null);
    }
    if (TagId) {
      request.input('TagId', sql.UniqueIdentifier, TagId);
    } else {
      request.input('TagId', sql.UniqueIdentifier, null);
    }
    const result = await request.execute('GetLearningVideo');

    // If fetching by id, return video and tags
    if (id) {
      const video = result.recordsets && result.recordsets[0] && result.recordsets[0][0];
      const tags = result.recordsets && result.recordsets[1] ? result.recordsets[1] : [];
      if (!video) {
        return res.status(404).json({ success: false, message: 'Video not found.' });
      }
      return res.status(200).json({ success: true, message: 'Video retrieved successfully', data: { ...video, Tags: tags } });
    }

    // If fetching by TagId or all, return list of videos
    return res.status(200).json({ success: true, message: 'Videos retrieved successfully', data: result.recordset });
  } catch (err) {
    console.error('Error retrieving learning video(s):', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve learning video(s)', error: err.message });
  }
};

// Delete a learning video
exports.deleteLearningVideo = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Video ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .execute('DeleteLearningVideo');
    // Success if procedure returns 1 as Success
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Success === 1) {
      return res.status(200).json({ success: true, message: 'Learning video deleted successfully.' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to delete learning video' });
    }
  } catch (err) {
    if (err.number === 50036) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }
    if (err.number === 50037) {
      return res.status(409).json({ success: false, message: 'Cannot delete video because it is referenced by other records.' });
    }
    console.error('Error deleting learning video:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete learning video', error: err.message });
  }
};

// Create a new daily challenge (Action Plan apis)
exports.createDailyChallenge = async (req, res) => {
  const { Title, Description, WhyItMatters } = req.body;

  // Validate input
  if (!Title || typeof Title !== 'string' || Title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Title is required.' });
  }
  if (!Description || typeof Description !== 'string' || Description.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Description is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Title', sql.NVarChar(100), Title)
      .input('Description', sql.NVarChar(500), Description)
      .input('WhyItMatters', sql.NVarChar(500), WhyItMatters || null)
      .execute('CreateDailyChallenge');

    // Return the created challenge directly
    if (result.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        success: true,
        message: 'Daily challenge created successfully',
        data: result.recordset[0]
      });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create daily challenge' });
    }
  } catch (err) {
    if (err.number === 50070) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    if (err.number === 50071) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }
    console.error('Error creating daily challenge:', err);
    return res.status(500).json({ success: false, message: 'Failed to create daily challenge', error: err.message });
  }
};

// Update an existing daily challenge (Action Plan apis)
exports.updateDailyChallenge = async (req, res) => {
  const { id } = req.params;
  const { Title, Description, WhyItMatters } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Challenge ID is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .input('Title', sql.NVarChar(100), Title || null)
      .input('Description', sql.NVarChar(500), Description || null)
      .input('WhyItMatters', sql.NVarChar(500), WhyItMatters || null)
      .execute('UpdateDailyChallenge');

    // Return the updated challenge directly
    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Daily challenge updated successfully', data: result.recordset[0] });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to update daily challenge' });
    }
  } catch (err) {
    if (err.number === 50004) {
      return res.status(400).json({ success: false, message: 'Challenge ID is required.' });
    }
    if (err.number === 50005) {
      return res.status(404).json({ success: false, message: 'Daily challenge not found.' });
    }
    console.error('Error updating daily challenge:', err);
    return res.status(500).json({ success: false, message: 'Failed to update daily challenge', error: err.message });
  }
};

// Get all daily challenges ((Action Plan apis))
exports.getAllDailyChallenges = async (req, res) => {
  const { IncludePast } = req.query;
  let includePastBit = 0;
  if (IncludePast !== undefined) {
    if (IncludePast === '1' || IncludePast === 1 || IncludePast === true || IncludePast === 'true') {
      includePastBit = 1;
    }
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('IncludePast', sql.Bit, includePastBit)
      .execute('GetAllDailyChallenges');
    return res.status(200).json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('Error retrieving daily challenges:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve daily challenges', error: err.message });
  }
};

// Delete a daily challenge(Action Plan apis)
exports.deleteDailyChallenge = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Challenge ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .execute('DeleteDailyChallenge');
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Result === 'Success') {
      return res.status(200).json({ success: true, message: result.recordset[0].Message });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to delete daily challenge' });
    }
  } catch (err) {
    if (err.number === 50006) {
      return res.status(400).json({ success: false, message: 'Challenge ID is required.' });
    }
    if (err.number === 50007) {
      return res.status(404).json({ success: false, message: 'Daily challenge not found.' });
    }
    if (err.number === 50008) {
      return res.status(409).json({ success: false, message: 'Cannot delete challenge - it is being referenced by other records.' });
    }
    console.error('Error deleting daily challenge:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete daily challenge', error: err.message });
  }
};

// Create a new ingredient category
exports.createIngredientCategory = async (req, res) => {
  const { Keyword, CategoryName } = req.body;

  // Validate input
  if (!Keyword || typeof Keyword !== 'string' || Keyword.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Keyword is required.' });
  }
  if (!CategoryName || typeof CategoryName !== 'string' || CategoryName.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'CategoryName is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Keyword', sql.NVarChar(100), Keyword)
      .input('CategoryName', sql.NVarChar(100), CategoryName)
      .execute('CreateIngredientCategory');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Ingredient category created successfully', data: result.recordset[0] });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create ingredient category' });
    }
  } catch (err) {
    if (err.number === 50080) {
      return res.status(400).json({ success: false, message: 'Keyword is required.' });
    }
    if (err.number === 50081) {
      return res.status(400).json({ success: false, message: 'CategoryName is required.' });
    }
    console.error('Error creating ingredient category:', err);
    return res.status(500).json({ success: false, message: 'Failed to create ingredient category', error: err.message });
  }
};

// Update an existing ingredient category
exports.updateIngredientCategory = async (req, res) => {
  const { id } = req.params;
  const { Keyword, CategoryName } = req.body;

  // Validate input
  if (!id) {
    return res.status(400).json({ success: false, message: 'IngredientCategoryId is required.' });
  }
  if (!Keyword || typeof Keyword !== 'string' || Keyword.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Keyword is required.' });
  }
  if (!CategoryName || typeof CategoryName !== 'string' || CategoryName.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'CategoryName is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('IngredientCategoryId', sql.Int, parseInt(id, 10))
      .input('Keyword', sql.NVarChar(100), Keyword)
      .input('CategoryName', sql.NVarChar(100), CategoryName)
      .execute('UpdateIngredientCategory');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Ingredient category updated successfully', data: result.recordset[0] });
    } else {
      return res.status(404).json({ success: false, message: 'Ingredient category not found.' });
    }
  } catch (err) {
    if (err.number === 50082) {
      return res.status(400).json({ success: false, message: 'IngredientCategoryId is required.' });
    }
    if (err.number === 50080) {
      return res.status(400).json({ success: false, message: 'Keyword is required.' });
    }
    if (err.number === 50081) {
      return res.status(400).json({ success: false, message: 'CategoryName is required.' });
    }
    console.error('Error updating ingredient category:', err);
    return res.status(500).json({ success: false, message: 'Failed to update ingredient category', error: err.message });
  }
};

// Get all ingredient categories
exports.getAllIngredientCategories = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().execute('GetAllIngredientCategories');
    return res.status(200).json({ success: true, message: 'Ingredient categories retrieved successfully', data: result.recordset });
  } catch (err) {
    console.error('Error retrieving ingredient categories:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve ingredient categories', error: err.message });
  }
};

// Delete an ingredient category
exports.deleteIngredientCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'IngredientCategoryId is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('IngredientCategoryId', sql.Int, parseInt(id, 10))
      .execute('DeleteIngredientCategory');
    const rowsAffected = result.recordset && result.recordset[0] && result.recordset[0].RowsAffected;
    if (rowsAffected === 1) {
      return res.status(200).json({ success: true, message: 'Ingredient category deleted successfully.' });
    } else {
      return res.status(404).json({ success: false, message: 'Ingredient category not found.' });
    }
  } catch (err) {
    if (err.number === 50082) {
      return res.status(400).json({ success: false, message: 'IngredientCategoryId is required.' });
    }
    console.error('Error deleting ingredient category:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete ingredient category', error: err.message });
  }
};

// Create a new recipe with instructions from JSON
exports.createRecipeWithInstructionsFromJson = async (req, res) => {
  const recipeJson = req.body;

  // Validate that body is an object
  if (!recipeJson || typeof recipeJson !== 'object') {
    return res.status(400).json({ success: false, message: 'Recipe JSON body is required.' });
  }

  // Convert to string for SQL input
  let recipeJsonStr;
  try {
    recipeJsonStr = JSON.stringify(recipeJson);
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('RecipeJson', sql.NVarChar(sql.MAX), recipeJsonStr)
      .execute('CreateRecipeWithInstructionsFromJson');

    // Success: return the new RecipeId
    if (result.recordset && result.recordset.length > 0) {
      return res.status(201).json({ success: true, message: 'Recipe created successfully', recipeId: result.recordset[0].RecipeId });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create recipe.' });
    }
  } catch (err) {
    // Handle SQL error numbers from the procedure
    if (err.number === 51000) {
      return res.status(400).json({ success: false, message: 'Invalid JSON input.' });
    }
    if (err.number === 51001) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    if (err.number === 51002) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }
    if (err.number === 51003) {
      return res.status(400).json({ success: false, message: 'MealType is required.' });
    }
    if (err.number === 51004) {
      return res.status(400).json({ success: false, message: 'Valid EstimatedPrepTime is required.' });
    }
    if (err.number === 51005) {
      return res.status(400).json({ success: false, message: 'Valid EstimatedCookTime is required.' });
    }
    if (err.number === 51006) {
      return res.status(400).json({ success: false, message: 'At least one valid instruction is required.' });
    }
    if (err.number === 51007) {
      return res.status(400).json({ success: false, message: 'Valid ingredients are required when provided.' });
    }
    if (err.number === 51008) {
      return res.status(400).json({ success: false, message: 'One or more ingredient category IDs are invalid.' });
    }
    if (err.number === 51009) {
      return res.status(400).json({ success: false, message: 'One or more tag IDs are invalid or do not exist.' });
    }
    console.error('Error creating recipe with instructions:', err);
    return res.status(500).json({ success: false, message: 'Failed to create recipe.', error: err.message });
  }
};

// Update an existing recipe with instructions from JSON
exports.updateRecipeWithInstructionsFromJson = async (req, res) => {
  const { id } = req.params;
  let recipeJson = req.body;

  // If body is a string, try to parse it
  if (typeof recipeJson === 'string') {
    try {
      recipeJson = JSON.parse(recipeJson);
    } catch {
      return res.status(400).json({ success: false, message: 'Supplement JSON body is not valid JSON.' });
    }
  }
  if (!id) {
    return res.status(400).json({ success: false, message: 'Recipe ID is required.' });
  }
  if (!recipeJson || typeof recipeJson !== 'object' || Array.isArray(recipeJson)) {
    return res.status(400).json({ success: false, message: 'Recipe JSON body is required and must be an object.' });
  }
  let recipeJsonStr;
  try {
    recipeJsonStr = JSON.stringify(recipeJson);
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('RecipeId', sql.UniqueIdentifier, id)
      .input('RecipeJson', sql.NVarChar(sql.MAX), recipeJsonStr)
      .execute('UpdateRecipeWithInstructionsFromJson');
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Success === 1) {
      return res.status(200).json({ success: true, message: 'Recipe updated successfully.', recipeId: result.recordset[0].RecipeId });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to update recipe.' });
    }
  } catch (err) {
    if (err.number === 51000) {
      return res.status(400).json({ success: false, message: 'Invalid JSON input.' });
    }
    if (err.number === 51006) {
      return res.status(400).json({ success: false, message: 'At least one valid instruction is required when provided.' });
    }
    if (err.number === 51007) {
      return res.status(400).json({ success: false, message: 'Valid ingredients are required when provided.' });
    }
    if (err.number === 51008) {
      return res.status(400).json({ success: false, message: 'One or more ingredient category IDs are invalid.' });
    }
    if (err.number === 51009) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }
    console.error('Error updating recipe:', err);
    return res.status(500).json({ success: false, message: 'Failed to update recipe.', error: err.message });
  }
};

// Create a new supplement
exports.createSupplement = async (req, res) => {
  let supplementJson = req.body;
  // If body is a string, try to parse it
  if (typeof supplementJson === 'string') {
    try {
      supplementJson = JSON.parse(supplementJson);
    } catch {
      return res.status(400).json({ success: false, message: 'Supplement JSON body is not valid JSON.' });
    }
  }
  // If body is not an object (e.g. a plain string), error
  if (!supplementJson || typeof supplementJson !== 'object' || Array.isArray(supplementJson)) {
    return res.status(400).json({ success: false, message: 'Supplement JSON body is required and must be an object.' });
  }
  // Validate required fields
  if (!supplementJson.name || !supplementJson.category) {
    return res.status(400).json({ success: false, message: 'Required fields (name, category) missing.' });
  }
  let supplementJsonStr;
  try {
    supplementJsonStr = JSON.stringify(supplementJson);
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body.' });
  }
  // Debug: log what is being sent to SQL
  // console.log('SupplementJson for SQL:', supplementJsonStr);
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('SupplementJson', sql.NVarChar(sql.MAX), supplementJsonStr)
      .execute('CreateSupplement');
    if (result.recordset && result.recordset.length > 0) {
      return res.status(201).json({ success: true, message: 'Supplement created successfully', supplementId: result.recordset[0].SupplementId });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create supplement.' });
    }
  } catch (err) {
    if (err.number === 51000) {
      return res.status(400).json({ success: false, message: 'Invalid JSON input.' });
    }
    if (err.number === 51001) {
      return res.status(400).json({ success: false, message: 'Required fields (name, category) missing.' });
    }
    console.error('Error creating supplement:', err);
    return res.status(500).json({ success: false, message: 'Failed to create supplement.', error: err.message });
  }
};

// Get a supplement by ID (with benefits, warnings, drug interactions)
exports.getSupplement = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Supplement ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('SupplementId', sql.UniqueIdentifier, id)
      .execute('GetSupplement');
    // result.recordsets: [supplement, benefits, warnings, drugInteractions]
    const supplement = result.recordsets[0] && result.recordsets[0][0];
    if (!supplement) {
      return res.status(404).json({ success: false, message: 'Supplement not found.' });
    }
    supplement.benefits = result.recordsets[1]?.map(r => r.Description) || [];
    supplement.warnings = result.recordsets[2]?.map(r => r.Description) || [];
    supplement.drugInteractions = result.recordsets[3]?.map(r => r.Description) || [];
    return res.status(200).json({ success: true, data: supplement });
  } catch (err) {
    console.error('Error retrieving supplement:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve supplement.' });
  }
};

// Update a supplement by ID (with benefits, warnings, drug interactions)
exports.updateSupplement = async (req, res) => {
  const { id } = req.params;
  let supplementJson = req.body;
  if (typeof supplementJson === 'string') {
    try {
      supplementJson = JSON.parse(supplementJson);
    } catch {
      return res.status(400).json({ success: false, message: 'Supplement JSON body is not valid JSON.' });
    }
  }
  if (!id) {
    return res.status(400).json({ success: false, message: 'Supplement ID is required.' });
  }
  if (!supplementJson || typeof supplementJson !== 'object' || Array.isArray(supplementJson)) {
    return res.status(400).json({ success: false, message: 'Supplement JSON body is required and must be an object.' });
  }
  let supplementJsonStr;
  try {
    supplementJsonStr = JSON.stringify(supplementJson);
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('SupplementId', sql.UniqueIdentifier, id)
      .input('SupplementJson', sql.NVarChar(sql.MAX), supplementJsonStr)
      .execute('UpdateSupplement');
    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Supplement updated successfully', supplementId: result.recordset[0].SupplementId });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to update supplement.' });
    }
  } catch (err) {
    if (err.number === 51000) {
      return res.status(400).json({ success: false, message: 'Invalid JSON input.' });
    }
    console.error('Error updating supplement:', err);
    return res.status(500).json({ success: false, message: 'Failed to update supplement.', error: err.message });
  }
};

// Get all supplements (with optional includeInactive and category filter)
exports.getAllSupplements = async (req, res) => {
  const { includeInactive, category } = req.query;
  let includeInactiveBit = 0;
  if (includeInactive === '1' || includeInactive === 1 || includeInactive === true || includeInactive === 'true') {
    includeInactiveBit = 1;
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('IncludeInactive', sql.Bit, includeInactiveBit)
      .input('Category', sql.NVarChar(50), category || null)
      .execute('GetAllSupplements');
    // Each row contains Benefits, Warnings, DrugInteractions as JSON arrays
    const supplements = (result.recordset || []).map(row => ({
      ...row,
      benefits: row.Benefits ? JSON.parse(row.Benefits) : [],
      warnings: row.Warnings ? JSON.parse(row.Warnings) : [],
      drugInteractions: row.DrugInteractions ? JSON.parse(row.DrugInteractions) : []
    }));
    return res.status(200).json({ success: true, data: supplements });
  } catch (err) {
    console.error('Error retrieving supplements:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve supplements.' });
  }
};

// Delete a supplement by ID (with cascade)
exports.deleteSupplement = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Supplement ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('SupplementId', sql.UniqueIdentifier, id)
      .execute('DeleteSupplement');
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Success === 1) {
      return res.status(200).json({ success: true, message: 'Supplement deleted successfully.' });
    } else {
      return res.status(404).json({ success: false, message: 'Supplement not found.' });
    }
  } catch (err) {
    console.error('Error deleting supplement:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete supplement.' });
  }
};

// Get a recipe with instructions and ingredients by RecipeId
exports.getRecipeWithInstructionsAndIngredients = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Recipe ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('RecipeId', sql.UniqueIdentifier, id)
      .execute('GetRecipeWithInstructionsAndIngredients');
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].RecipeJson) {
      // Parse the JSON string from SQL
      const recipe = JSON.parse(result.recordset[0].RecipeJson);
      return res.status(200).json({ success: true, message: 'Recipe retrieved successfully', data: recipe });
    } else {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }
  } catch (err) {
    if (err.number === 51009) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }
    console.error('Error retrieving recipe:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve recipe', error: err.message });
  }
};

// Delete a recipe by ID (with cascade)
exports.deleteRecipeWithDependencies = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Recipe ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('RecipeId', sql.UniqueIdentifier, id)
      .execute('DeleteRecipeWithDependencies');
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Success === 1) {
      return res.status(200).json({ success: true, message: 'Recipe deleted successfully.' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to delete recipe.' });
    }
  } catch (err) {
    if (err.number === 51009) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }
    console.error('Error deleting recipe:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete recipe', error: err.message });
  }
};

// Get all contact us submissions with pagination and optional status filter
exports.getAllContactUsSubmissions = async (req, res) => {
  const { Status, PageNumber, PageSize } = req.query;
  const pageNumber = parseInt(PageNumber, 10) || 1;
  const pageSize = parseInt(PageSize, 10) || 10;

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Status', sql.NVarChar(20), Status || null)
      .input('PageNumber', sql.Int, pageNumber)
      .input('PageSize', sql.Int, pageSize)
      .execute('GetAllContactUsSubmissions');

    const row = result.recordset && result.recordset[0];
    if (!row) {
      return res.status(500).json({ success: false, message: 'Failed to retrieve contact submissions.' });
    }

    const status = parseInt(row.status, 10);
    const isSuccess = row.success === 'true';

    if (!isSuccess) {
      return res.status(status).json({ success: false, message: row.message });
    }

    let data = [];
    if (row.data) {
      try {
        data = JSON.parse(row.data);
      } catch {
        data = [];
      }
    }

    return res.status(200).json({
      success: true,
      message: row.message,
      totalCount: row.totalCount,
      totalPages: row.totalPages,
      currentPage: row.currentPage,
      pageSize: row.pageSize,
      data
    });
  } catch (err) {
    console.error('Error retrieving contact submissions:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve contact submissions.' });
  }
};

// Update the status of a contact us submission
exports.updateContactUsStatus = async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;
  // Optionally, you can get admin userId from req.user if you have authentication
  const adminUserId = req.user ? req.user.userId : null;

  if (!id || !Status) {
    return res.status(400).json({ success: false, message: 'Id and Status are required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .input('Status', sql.NVarChar(20), Status)
      .input('UserId', sql.UniqueIdentifier, adminUserId)
      .execute('UpdateContactUsStatus');

    const row = result.recordset && result.recordset[0];
    if (!row) {
      return res.status(500).json({ success: false, message: 'Failed to update contact submission status.' });
    }

    const status = parseInt(row.status, 10);
    const isSuccess = row.success === 'true';

    if (!isSuccess) {
      return res.status(status).json({ success: false, message: row.message });
    }

    let data = null;
    if (row.data) {
      try {
        data = JSON.parse(row.data);
      } catch {
        data = row.data;
      }
    }

    return res.status(200).json({
      success: true,
      message: row.message,
      data
    });
  } catch (err) {
    console.error('Error updating contact submission status:', err);
    return res.status(500).json({ success: false, message: 'Failed to update contact submission status.' });
  }
};

// Get all recipes as a JSON array
exports.getAllRecipes = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().execute('GetAllRecipes');
    const row = result.recordset && result.recordset[0];
    if (!row || !row.RecipesJson) {
      return res.status(404).json({ success: false, message: 'No recipes found.' });
    }
    let recipes = [];
    try {
      recipes = JSON.parse(row.RecipesJson);
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to parse recipes JSON.' });
    }
    return res.status(200).json({ success: true,message:'Recipes retrieved successfully', data: recipes });
  } catch (err) {
    console.error('Error retrieving all recipes:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve recipes.' });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    // Ensure we have a proper request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Goal data must be provided as a JSON object'
      });
    }

    const goalData = { ...req.body };

    // Validate required fields
    const requiredFields = ['title', 'description', 'category'];
    const missingFields = requiredFields.filter(field => !goalData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Stringify the goal data
    let goalJsonStr;
    try {
      goalJsonStr = JSON.stringify(goalData);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid goal data format'
      });
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('GoalJson', sql.NVarChar(sql.MAX), goalJsonStr)
      .execute('CreateGoal');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: {
          goalId: result.recordset[0].GoalId
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to create goal - no ID returned'
      });
    }
  } catch (err) {
    console.error('Error creating goal:', err);

    if (err.number === 51000) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON input'
      });
    }
    if (err.number === 51001) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing',
        requiredFields: ['title', 'description', 'category']
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create goal',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update an existing goal
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate goal ID
    if (!id || !isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Valid goal ID is required.'
      });
    }

    // Validate request body
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Goal data must be a valid JSON object.'
      });
    }

    // Clean the goal data
    const goalData = { ...req.body };
    Object.keys(goalData).forEach(key => {
      if (goalData[key] === undefined || goalData[key] === null) {
        delete goalData[key];
      }
    });

    // At least one field must be provided
    if (Object.keys(goalData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update.'
      });
    }

    // Convert to JSON string
    let goalJsonStr;
    try {
      goalJsonStr = JSON.stringify(goalData);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid goal data format.'
      });
    }

    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('GoalId', sql.UniqueIdentifier, id)
      .input('GoalJson', sql.NVarChar(sql.MAX), goalJsonStr)
      .execute('UpdateGoal');

    if (result.recordset && result.recordset[0] && result.recordset[0].Success === 1) {
      return res.status(200).json({
        success: true,
        message: 'Goal updated successfully.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to update goal.'
      });
    }
  } catch (err) {
    console.error('Error updating goal:', err);

    if (err.number === 51000) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON input.'
      });
    }
    if (err.number === 51011) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update goal.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Helper function to validate UUID
function isValidUUID(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}


exports.deleteGoal = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Goal ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('GoalId', sql.UniqueIdentifier, id)
      .execute('DeleteGoal');
    
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Result === 'Success') {
      return res.status(200).json({ 
        success: true, 
        message: result.recordset[0].Message 
      });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to delete goal' });
    }
  } catch (err) {
    if (err.number === 51009) {
      return res.status(400).json({ success: false, message: 'Goal ID is required.' });
    }
    if (err.number === 51010) {
      return res.status(404).json({ success: false, message: 'Goal not found.' });
    }
    if (err.number === 51011) {
      return res.status(409).json({ success: false, message: 'Cannot delete goal - it is being referenced by other records.' });
    }
    console.error('Error deleting goal:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete goal.', error: err.message });
  }
};


exports.getAllGoals = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().execute('GetAllGoals');
    
    // The stored procedure returns JSON directly
    const goalsJson = result.recordset && result.recordset[0] ? Object.values(result.recordset[0])[0] : '[]';
    
    let goals = [];
    try {
      goals = JSON.parse(goalsJson);
    } catch (err) {
      console.error('Error parsing goals JSON:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to parse goals JSON.' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Goals retrieved successfully', 
      data: goals 
    });
  } catch (err) {
    console.error('Error retrieving all goals:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve goals.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.setGoalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id || typeof status !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Goal ID and status (boolean) are required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('GoalId', sql.UniqueIdentifier, id)
      .input('Status', sql.Bit, status ? 1 : 0)
      .execute('SetGoalStatus');
    const message = result.recordset && result.recordset[0] && result.recordset[0].Message;
    return res.status(200).json({ success: true, message: message || 'Status updated successfully.' });
  } catch (err) {
    if (err.number === 51012) {
      return res.status(404).json({ success: false, message: 'Goal not found.' });
    }
    console.error('Error updating goal status:', err);
    return res.status(500).json({ success: false, message: 'Failed to update goal status.', error: err.message });
  }
};

// Assign a daily challenge to a new date
exports.assignDailyChallenge = async (req, res) => {
  const { id } = req.params;
  const { NewDate } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'DailyChallengeId is required.' });
  }
  if (!NewDate) {
    return res.status(400).json({ success: false, message: 'NewDate is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('DailyChallengeId', sql.UniqueIdentifier, id)
      .input('NewDate', sql.Date, NewDate)
      .execute('AssignDailyChallenge');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Daily challenge assigned to new date successfully', data: result.recordset[0] });
    } else {
      return res.status(404).json({ success: false, message: 'Daily challenge not found.' });
    }
  } catch (err) {
    if (err.number === 50080) {
      return res.status(400).json({ success: false, message: 'DailyChallengeId is required.' });
    }
    if (err.number === 50081) {
      return res.status(400).json({ success: false, message: 'NewDate is required.' });
    }
    if (err.number === 50082) {
      return res.status(404).json({ success: false, message: 'Daily challenge not found.' });
    }
    console.error('Error assigning daily challenge:', err);
    return res.status(500).json({ success: false, message: 'Failed to assign daily challenge', error: err.message });
  }
};

// Create a new (Action Plan apis)
exports.createActionPlan = async (req, res) => {
  const { Title, Description, WhyItMatters } = req.body;

  // Validate input
  if (!Title || typeof Title !== 'string' || Title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Action plan title is required.' });
  }
  if (!Description || typeof Description !== 'string' || Description.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Action plan description is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Title', sql.NVarChar(100), Title)
      .input('Description', sql.NVarChar(500), Description)
      .input('WhyItMatters', sql.NVarChar(500), WhyItMatters || null)
      .execute('CreateActionPlan');

    // Return the created action plan directly
    if (result.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        success: true,
        message: 'Action plan created successfully',
        data: result.recordset[0]
      });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create action plan' });
    }
  } catch (err) {
    if (err.number === 50070) {
      return res.status(400).json({ success: false, message: 'Action plan title is required.' });
    }
    if (err.number === 50071) {
      return res.status(400).json({ success: false, message: 'Action plan description is required.' });
    }
    console.error('Error creating action plan:', err);
    return res.status(500).json({ success: false, message: 'Failed to create action plan', error: err.message });
  }
};

// Update an existing (Action Plan apis)
exports.updateActionPlan = async (req, res) => {
  const { id } = req.params;
  const { Title, Description, WhyItMatters } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Action plan ID is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .input('Title', sql.NVarChar(100), Title || null)
      .input('Description', sql.NVarChar(500), Description || null)
      .input('WhyItMatters', sql.NVarChar(500), WhyItMatters || null)
      .execute('UpdateActionPlan');

    // Return the updated action plan directly
    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({ success: true, message: 'Action plan updated successfully', data: result.recordset[0] });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to update action plan' });
    }
  } catch (err) {
    if (err.number === 50004) {
      return res.status(400).json({ success: false, message: 'Action plan ID is required.' });
    }
    if (err.number === 50005) {
      return res.status(404).json({ success: false, message: 'Action plan not found.' });
    }
    console.error('Error updating action plan:', err);
    return res.status(500).json({ success: false, message: 'Failed to update action plan', error: err.message });
  }
};

// Get all action plans with assigned users
exports.getAllActionPlans = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .execute('GetAllActionPlans');
    
    // Parse the Users JSON for each action plan
    const actionPlans = result.recordset.map(plan => ({
      ...plan,
      Users: plan.Users ? JSON.parse(plan.Users) : []
    }));
    
    return res.status(200).json({ 
      success: true, 
      message: 'Action plans retrieved successfully',
      data: actionPlans 
    });
  } catch (err) {
    console.error('Error retrieving action plans:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve action plans', error: err.message });
  }
};

// Delete an action plan
exports.deleteActionPlan = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'Action plan ID is required.' });
  }
  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Id', sql.UniqueIdentifier, id)
      .execute('DeleteActionPlan');
    
    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Result === 'Success') {
      return res.status(200).json({ 
        success: true, 
        message: result.recordset[0].Message 
      });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to delete action plan' });
    }
  } catch (err) {
    if (err.number === 50084) {
      return res.status(400).json({ success: false, message: 'Action plan ID is required.' });
    }
    if (err.number === 50085) {
      return res.status(404).json({ success: false, message: 'Action plan not found.' });
    }
    if (err.number === 50086) {
      return res.status(409).json({ success: false, message: 'Cannot delete action plan - it is being referenced by other records.' });
    }
    console.error('Error deleting action plan:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete action plan', error: err.message });
  }
};

// Assign an action plan to multiple users
exports.assignActionPlanToUser = async (req, res) => {
  const { UserIds, PlanId, StartDate, EndDate } = req.body;

  // Validate required fields
  if (!UserIds || !PlanId) {
    return res.status(400).json({
      success: false,
      message: 'UserIds and PlanId are required.'
    });
  }

  // Validate UserIds format (should be comma-separated UUIDs)
  if (typeof UserIds !== 'string' || UserIds.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'UserIds must be a comma-separated string of user IDs.'
    });
  }

  // Validate date format if provided
  if (StartDate) {
    const startDateObj = new Date(StartDate);
    if (isNaN(startDateObj.getTime())) {
      return res.status(400).json({ success: false, message: 'StartDate must be a valid date.' });
    }
  }

  if (EndDate) {
    const endDateObj = new Date(EndDate);
    if (isNaN(endDateObj.getTime())) {
      return res.status(400).json({ success: false, message: 'EndDate must be a valid date.' });
    }
  }

  try {
    const pool = await connectToDatabase();
    const request = pool.request()
      .input('UserIds', sql.NVarChar(sql.MAX), UserIds)
      .input('PlanId', sql.UniqueIdentifier, PlanId)
      .input('StartDate', sql.Date, StartDate || null)
      .input('EndDate', sql.Date, EndDate || null);

    const result = await request.execute('AssignActionPlanToUsers');

    // Success: return all assigned action plan details
    if (result.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        success: true,
        message: 'Action plan assigned to users successfully.',
        data: result.recordset
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to assign action plan to users.'
      });
    }
  } catch (err) {
    if (err.number === 50073) {
      return res.status(404).json({ success: false, message: 'Action plan does not exist.' });
    }
    console.error('Error assigning action plan to users:', err);
    return res.status(500).json({ success: false, message: 'Failed to assign action plan to users.', error: err.message });
  }
};

// Assign a goal to multiple action plans
exports.assignGoalToActionPlan = async (req, res) => {
  const { ActionPlanIds, GoalId } = req.body;

  // Validate required fields
  if (!ActionPlanIds || !GoalId) {
    return res.status(400).json({
      success: false,
      message: 'ActionPlanIds and GoalId are required.'
    });
  }

  // Validate ActionPlanIds format (should be comma-separated UUIDs)
  if (typeof ActionPlanIds !== 'string' || ActionPlanIds.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'ActionPlanIds must be a comma-separated string of action plan IDs.'
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('ActionPlanIds', sql.NVarChar(sql.MAX), ActionPlanIds)
      .input('GoalId', sql.UniqueIdentifier, GoalId)
      .execute('AssignGoalToActionPlans');

    // Check if the stored procedure executed successfully (no errors thrown)
    // Even if no records were returned, it might still be successful
    // (e.g., all goals were already assigned)
    
    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      // Rows were inserted/affected
      return res.status(201).json({
        success: true,
        message: 'Goal assigned to action plans successfully.',
        data: result.recordset || []
      });
    } else if (result.recordset && result.recordset.length > 0) {
      // No rows affected but we have a recordset (informational message)
      return res.status(200).json({
        success: true,
        message: 'Operation completed - may contain informational messages.',
        data: result.recordset
      });
    } else {
      // No rows affected and no recordset - likely all goals already assigned
      return res.status(200).json({
        success: true,
        message: 'Goal was already assigned to all specified action plans or no valid action plan IDs provided.',
        data: []
      });
    }
  } catch (err) {
    if (err.number === 50076) {
      return res.status(404).json({ success: false, message: 'Goal does not exist.' });
    }
    console.error('Error assigning goal to action plans:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to assign goal to action plans.', 
      error: err.message 
    });
  }
};

// Add a new ingredient
exports.addIngredient = async (req, res) => {
  const {
    Ingredient,
    IngredientCategoryId,
    Description,
    ImageUrl,
    Notes,
    FODMAPLevel,
    FODMAPNotes,
    FodmapMaxQuantity,
    FodmapDetails,
    Source,
    Active
  } = req.body;

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('Ingredient', sql.NVarChar(100), Ingredient)
      .input('IngredientCategoryId', sql.Int, IngredientCategoryId)
      .input('Description', sql.NVarChar(500), Description || null)
      .input('ImageUrl', sql.NVarChar(255), ImageUrl || null)
      .input('Notes', sql.NVarChar(1000), Notes || null)
      .input('FODMAPLevel', sql.NVarChar(50), FODMAPLevel || null)
      .input('FODMAPNotes', sql.NVarChar(1000), FODMAPNotes || null)
      .input('FodmapMaxQuantity', sql.Decimal(10,2), FodmapMaxQuantity !== undefined && FodmapMaxQuantity !== null && FodmapMaxQuantity !== '' ? FodmapMaxQuantity : null)
      .input('FodmapDetails', sql.NVarChar(1000), FodmapDetails || null)
      .input('Source', sql.NVarChar(255), Source || null)
      .input('Active', sql.Bit, Active === undefined ? 1 : (Active ? 1 : 0))
      .execute('AddIngredient');

    if (result.recordset && result.recordset.length > 0) {
      const newIngredient = result.recordset[0];
      return res.status(201).json({ 
        success: true, 
        message: 'Ingredient added successfully', 
        data: newIngredient
      });
    } else {
      throw new Error('No record returned after insert');
    }
  } catch (err) {
    console.error('Error adding ingredient:', err);
    
    // Handle specific error cases
    if (err.number === 50000) {
      return res.status(400).json({ success: false, message: 'Ingredient name is required.' });
    }
    if (err.number === 50001) {
      return res.status(400).json({ success: false, message: 'IngredientCategoryId is required.' });
    }
    if (err.number === 50002) {
      return res.status(400).json({ success: false, message: 'Invalid IngredientCategoryId provided.' });
    }
    if (err.number === 50003) {
      return res.status(409).json({ success: false, message: 'Ingredient already exists (case-insensitive comparison).' });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to add ingredient.', 
      error: err.message 
    });
  }
};

exports.updateIngredient = async (req, res) => {
  const { id } = req.params;
  const {
    Ingredient,
    IngredientCategoryId,
    Description,
    ImageUrl,
    Notes,
    FODMAPLevel,
    FODMAPNotes,
    FodmapMaxQuantity,
    FodmapDetails,
    Source,
    Active
  } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'IngredientId is required.' });
  }

  // If no fields provided, reject
  if (
    Ingredient === undefined &&
    IngredientCategoryId === undefined &&
    Description === undefined &&
    ImageUrl === undefined &&
    Notes === undefined &&
    FODMAPLevel === undefined &&
    FODMAPNotes === undefined &&
    FodmapMaxQuantity === undefined &&
    FodmapDetails === undefined &&
    Source === undefined &&
    Active === undefined
  ) {
    return res.status(400).json({ success: false, message: 'At least one field to update must be provided.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('IngredientId', sql.UniqueIdentifier, id)
      .input('Ingredient', sql.NVarChar(100), Ingredient !== undefined ? Ingredient : null)
      .input('IngredientCategoryId', sql.Int, IngredientCategoryId !== undefined ? IngredientCategoryId : null)
      .input('Description', sql.NVarChar(500), Description !== undefined ? Description : null)
      .input('ImageUrl', sql.NVarChar(255), ImageUrl !== undefined ? ImageUrl : null)
      .input('Notes', sql.NVarChar(1000), Notes !== undefined ? Notes : null)
      .input('FODMAPLevel', sql.NVarChar(50), FODMAPLevel !== undefined ? FODMAPLevel : null)
      .input('FODMAPNotes', sql.NVarChar(1000), FODMAPNotes !== undefined ? FODMAPNotes : null)
      .input('FodmapMaxQuantity', sql.Decimal(10,2), FodmapMaxQuantity !== undefined && FodmapMaxQuantity !== null && FodmapMaxQuantity !== '' ? FodmapMaxQuantity : null)
      .input('FodmapDetails', sql.NVarChar(1000), FodmapDetails !== undefined ? FodmapDetails : null)
      .input('Source', sql.NVarChar(255), Source !== undefined ? Source : null)
      .input('Active', sql.Bit, Active !== undefined ? (Active ? 1 : 0) : null)
      .execute('UpdateIngredient');

    const row = result.recordset && result.recordset[0];
    if (row && row.RowsAffected === 1) {
      return res.status(200).json({ success: true, message: 'Ingredient updated successfully.' });
    } else {
      return res.status(404).json({ success: false, message: 'Ingredient with provided ID does not exist.' });
    }
  } catch (err) {
    if (err.message && err.message.includes('does not exist')) {
      return res.status(404).json({ success: false, message: 'Ingredient with provided ID does not exist.' });
    }
    if (err.message && err.message.includes('Another ingredient with this name already exists')) {
      return res.status(409).json({ success: false, message: 'Another ingredient with this name already exists (case-insensitive comparison).' });
    }
    if (err.message && err.message.includes('Invalid IngredientCategoryId')) {
      return res.status(400).json({ success: false, message: 'Invalid IngredientCategoryId provided.' });
    }
    console.error('Error updating ingredient:', err);
    return res.status(500).json({ success: false, message: 'Failed to update ingredient.', error: err.message });
  }
};

// Get all ingredients as a JSON array
exports.getAllIngredients = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().execute('GetAllIngredients');
    const row = result.recordset && result.recordset[0];
    
    if (!row || !row.IngredientsJson) {
      return res.status(404).json({ success: false, message: 'No ingredients found.' });
    }
    
    let ingredients = [];
    try {
      ingredients = JSON.parse(row.IngredientsJson);
      
      // Parse the nested category JSON strings for each ingredient
      ingredients = ingredients.map(ingredient => {
        if (typeof ingredient.category === 'string') {
          try {
            ingredient.category = JSON.parse(ingredient.category);
          } catch (categoryParseError) {
            console.error('Error parsing category JSON:', categoryParseError);
            ingredient.category = null;
          }
        }
        return ingredient;
      });
      
    } catch (err) {
      console.error('Error parsing ingredients JSON:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to parse ingredients JSON.' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Ingredients retrieved successfully', 
      data: ingredients 
    });
    
  } catch (err) {
    console.error('Error retrieving all ingredients:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve ingredients.',
      error: err.message 
    });
  }
};

exports.getIngredient = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'Ingredient ID is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('IngredientId', sql.UniqueIdentifier, id)
      .execute('GetIngredientById');

    if (result.recordset && result.recordset.length > 0) {
      const ingredient = result.recordset[0];
      
      // Parse the main JSON string if IngredientJson exists
      if (ingredient.IngredientJson) {
        try {
          const parsedData = JSON.parse(ingredient.IngredientJson);
          
          // Parse the nested category JSON string if it exists
          if (typeof parsedData.category === 'string') {
            try {
              parsedData.category = JSON.parse(parsedData.category);
            } catch (categoryParseError) {
              console.error('Error parsing category JSON:', categoryParseError);
              parsedData.category = null;
            }
          }
          
          return res.status(200).json({ 
            success: true, 
            message: 'Ingredient retrieved successfully', 
            data: parsedData 
          });
        } catch (parseError) {
          console.error('Error parsing ingredient JSON:', parseError);
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to parse ingredient data.' 
          });
        }
      }
      
      // If no IngredientJson field, return as-is
      return res.status(200).json({ 
        success: true, 
        message: 'Ingredient retrieved successfully', 
        data: ingredient 
      });
    } else {
      return res.status(404).json({ success: false, message: 'Ingredient not found.' });
    }
  } catch (err) {
    console.error('Error retrieving ingredient:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve ingredient.',
      error: err.message 
    });
  }
};

// Delete an ingredient by ID
exports.deleteIngredient = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'Ingredient ID is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('IngredientId', sql.UniqueIdentifier, id)
      .execute('DeleteIngredient');

    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Success === 1) {
      return res.status(200).json({ 
        success: true, 
        message: 'Ingredient deleted successfully' 
      });
    } else {
      return res.status(404).json({ 
        success: false, 
        message: 'Ingredient not found or could not be deleted' 
      });
    }
  } catch (err) {
    console.error('Error deleting ingredient:', err);
    
    if (err.number === 51020) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ingredient not found' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to delete ingredient', 
      error: err.message 
    });
  }
};

// create v2 for recipe creation
// Create a new recipe with instructions from JSON
exports.createRecipeWithInstructionsFromJsonV2 = async (req, res) => {
  const recipeJson = req.body;

  // Validate that body is an object
  if (!recipeJson || typeof recipeJson !== 'object') {
    return res.status(400).json({ success: false, message: 'Recipe JSON body is required.' });
  }

  // Convert to string for SQL input
  let recipeJsonStr;
  try {
    recipeJsonStr = JSON.stringify(recipeJson);
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('RecipeJson', sql.NVarChar(sql.MAX), recipeJsonStr)
      .execute('CreateRecipeWithInstructionsFromJsonV2');

    // Success: return the new RecipeId
    if (result.recordset && result.recordset.length > 0) {
      return res.status(201).json({ success: true, message: 'Recipe created successfully', recipeId: result.recordset[0].RecipeId });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create recipe.' });
    }
  } catch (err) {
    // Handle SQL error numbers from the procedure
    if (err.number === 51000) {
      return res.status(400).json({ success: false, message: 'Invalid JSON input.' });
      
    }
    if (err.number === 51001) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }
    if (err.number === 51002) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }
    if (err.number === 51003) {
      return res.status(400).json({ success: false, message: 'MealType is required.' });
    }
    if (err.number === 51004) {
      return res.status(400).json({ success: false, message: 'Valid EstimatedPrepTime is required.' });
    }
    if (err.number === 51005) {
      return res.status(400).json({ success: false, message: 'Valid EstimatedCookTime is required.' });
    }
    if (err.number === 51006) {
      return res.status(400).json({ success: false, message: 'At least one valid instruction is required.' });
    }
    if (err.number === 51007) {
      return res.status(400).json({ success: false, message: 'Valid ingredients are required when provided.' });
    }
    if (err.number === 51008) {
      return res.status(400).json({ success: false, message: 'One or more ingredient category IDs are invalid.' });
    }
    if (err.number === 51009) {
      return res.status(400).json({ success: false, message: 'One or more tag IDs are invalid or do not exist.' });
    }
    console.error('Error creating recipe with instructions:', err);
    return res.status(500).json({ success: false, message: 'Failed to create recipe.', error: err.message });
  }
};

// Update a recipe with instructions and ingredients from JSON
exports.updateRecipeWithInstructionsFromJsonV2 = async (req, res) => {
  const { id } = req.params;
  let recipeJson = req.body;

  // Validate recipe ID
  if (!id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Recipe ID is required.' 
    });
  }

  // If body is a string, try to parse it
  if (typeof recipeJson === 'string') {
    try {
      recipeJson = JSON.parse(recipeJson);
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: 'Recipe JSON body is not valid JSON.' 
      });
    }
  }

  // Validate JSON structure
  if (!recipeJson || typeof recipeJson !== 'object' || Array.isArray(recipeJson)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Recipe JSON body is required and must be an object.' 
    });
  }

  // Convert back to string for SQL procedure
  let recipeJsonStr;
  try {
    recipeJsonStr = JSON.stringify(recipeJson);
  } catch (err) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid JSON body.' 
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('RecipeId', sql.UniqueIdentifier, id)
      .input('RecipeJson', sql.NVarChar(sql.MAX), recipeJsonStr)
      .execute('UpdateRecipeWithInstructionsFromJsonV2');

    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Success === 1) {
      return res.status(200).json({ 
        success: true, 
        message: 'Recipe updated successfully.', 
        recipeId: result.recordset[0].RecipeId 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update recipe.' 
      });
    }
  } catch (err) {
    // Handle specific error codes from the stored procedure
    switch (err.number) {
      case 51000:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid JSON input.' 
        });
      case 51001:
        return res.status(400).json({ 
          success: false, 
          message: 'Title cannot be empty.' 
        });
      case 51002:
        return res.status(400).json({ 
          success: false, 
          message: 'Description cannot be empty.' 
        });
      case 51003:
        return res.status(400).json({ 
          success: false, 
          message: 'MealType cannot be empty.' 
        });
      case 51004:
        return res.status(400).json({ 
          success: false, 
          message: 'Valid EstimatedPrepTime is required.' 
        });
      case 51005:
        return res.status(400).json({ 
          success: false, 
          message: 'Valid EstimatedCookTime is required.' 
        });
      case 51006:
        return res.status(400).json({ 
          success: false, 
          message: 'At least one valid instruction is required when provided.' 
        });
      case 51007:
        return res.status(400).json({ 
          success: false, 
          message: 'One or more ingredient IDs are invalid or do not exist.',
          invalidIngredients: err.recordset 
        });
      case 51008:
        return res.status(400).json({ 
          success: false, 
          message: 'One or more ingredients are not active.',
          inactiveIngredients: err.recordset 
        });
      case 51009:
        return res.status(404).json({ 
          success: false, 
          message: 'Recipe not found.' 
        });
      case 51010:
        return res.status(400).json({ 
          success: false, 
          message: 'One or more tags are not active.',
          inactiveTags: err.recordset 
        });
      default:
        console.error('Error updating recipe:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update recipe.', 
          error: err.message 
        });
    }
  }
};

// Create a new User Action Plan Narrative
exports.createUserActionPlanNarrative = async (req, res) => {
  const { UserID, OrderNo, SummaryText, DisplayStartDate } = req.body;

  // Validate required fields
  if (!UserID || !OrderNo || !SummaryText || !DisplayStartDate) {
    return res.status(400).json({
      success: false,
      message: 'UserID, OrderNo, SummaryText, and DisplayStartDate are required.'
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('UserID', sql.UniqueIdentifier, UserID)
      .input('OrderNo', sql.NVarChar(100), OrderNo)
      .input('SummaryText', sql.NVarChar(sql.MAX), SummaryText)
      .input('DisplayStartDate', sql.DateTime, DisplayStartDate)
      .execute('CreateUserActionPlanNarrative');

    const row = result.recordset && result.recordset[0];
    if (row && row.NarrativeID) {
      return res.status(201).json({
        success: true,
        message: 'User action plan narrative created successfully.',
        narrativeId: row.NarrativeID
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user action plan narrative.'
      });
    }
  } catch (err) {
    console.error('Error creating user action plan narrative:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user action plan narrative.',
      error: err.message
    });
  }
};

// Create a new Narrative Section
exports.createNarrativeSection = async (req, res) => {
  const { NarrativeID, SectionOrder, SectionHeading, SectionBody } = req.body;

  // Validate required fields
  if (
    NarrativeID === undefined ||
    SectionOrder === undefined ||
    !SectionHeading ||
    !SectionBody
  ) {
    return res.status(400).json({
      success: false,
      message: 'NarrativeID, SectionOrder, SectionHeading, and SectionBody are required.'
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('NarrativeID', sql.Int, NarrativeID)
      .input('SectionOrder', sql.Int, SectionOrder)
      .input('SectionHeading', sql.NVarChar(455), SectionHeading)
      .input('SectionBody', sql.NVarChar(sql.MAX), SectionBody)
      .execute('CreateNarrativeSection');

    const row = result.recordset && result.recordset[0];
    if (row && row.SectionID) {
      return res.status(201).json({
        success: true,
        message: 'Narrative section created successfully.',
        sectionId: row.SectionID
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to create narrative section.'
      });
    }
  } catch (err) {
    console.error('Error creating narrative section:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create narrative section.',
      error: err.message
    });
  }
};

/**
 * Get a user action plan narrative and its sections by NarrativeID
 */
exports.getUserActionPlanNarrativeByNarrativeID = async (req, res) => {
  const narrativeId = parseInt(req.params.narrativeId, 10);
  if (!narrativeId || isNaN(narrativeId)) {
    return res.status(400).json({
      success: false,
      message: 'NarrativeID is required.',
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('NarrativeID', sql.Int, narrativeId)
      .execute('GetUserActionPlanNarrativeByNarrativeID');

    if (!result || !result.recordset || result.recordset.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No narrative found for the given NarrativeID.',
        data: null,
      });
    }

    // Group narrative and sections
    const rows = result.recordset;
    const narrative = {
      NarrativeID: rows[0].NarrativeID,
      UserID: rows[0].UserID,
      OrderNo: rows[0].OrderNo,
      SummaryText: rows[0].SummaryText,
      DisplayStartDate: rows[0].DisplayStartDate,
      CreatedAt: rows[0].CreatedAt,
      UpdatedAt: rows[0].UpdatedAt,
      Sections: [],
    };

    rows.forEach(row => {
      if (row.SectionID) {
        narrative.Sections.push({
          SectionID: row.SectionID,
          SectionOrder: row.SectionOrder,
          SectionHeading: row.SectionHeading,
          SectionBody: row.SectionBody,
          SectionCreatedAt: row.SectionCreatedAt,
          SectionUpdatedAt: row.SectionUpdatedAt,
        });
      }
    });

    res.json({
      success: true,
      message: 'User action plan narrative fetched successfully.',
      data: narrative,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user action plan narrative.',
      error: error.message,
    });
  }
};

// Update a user action plan narrative (summary and display start date)
exports.updateUserActionPlanNarrative = async (req, res) => {
  const narrativeId = parseInt(req.params.narrativeId, 10);
  const { SummaryText, DisplayStartDate } = req.body;

  if (!narrativeId || !SummaryText || !DisplayStartDate) {
    return res.status(400).json({
      success: false,
      message: 'NarrativeID, SummaryText, and DisplayStartDate are required.'
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('NarrativeID', sql.Int, narrativeId)
      .input('SummaryText', sql.NVarChar(sql.MAX), SummaryText)
      .input('DisplayStartDate', sql.DateTime, DisplayStartDate)
      .execute('UpdateUserActionPlanNarrative');

    // Check if any rows were affected (optional, for stricter feedback)
    if (result.rowsAffected && result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'User action plan narrative not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User action plan narrative updated successfully.'
    });
  } catch (err) {
    console.error('Error updating user action plan narrative:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user action plan narrative.',
      error: err.message
    });
  }
};

// Delete a narrative section by SectionID
exports.deleteNarrativeSection = async (req, res) => {
  const sectionId = parseInt(req.params.sectionId, 10);
  if (!sectionId || isNaN(sectionId)) {
    return res.status(400).json({
      success: false,
      message: 'SectionID is required.'
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('SectionID', sql.Int, sectionId)
      .execute('DeleteNarrativeSection');

    // Optionally, check if a row was deleted
    if (result.rowsAffected && result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Narrative section not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Narrative section deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting narrative section:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete narrative section.',
      error: err.message
    });
  }
};

// Update a narrative section by SectionID
exports.updateNarrativeSection = async (req, res) => {
  const sectionId = parseInt(req.params.sectionId, 10);
  const { NarrativeID, SectionOrder, SectionHeading, SectionBody } = req.body;

  // Validate section ID
  if (!sectionId || isNaN(sectionId)) {
    return res.status(400).json({
      success: false,
      message: 'SectionID is required and must be a valid integer.'
    });
  }

  // Validate that at least one field is provided for update
  if (
    NarrativeID === undefined &&
    SectionOrder === undefined &&
    SectionHeading === undefined &&
    SectionBody === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: 'At least one field to update must be provided.'
    });
  }

  // Validate data types and constraints
  if (NarrativeID !== undefined && (!Number.isInteger(NarrativeID) || NarrativeID <= 0)) {
    return res.status(400).json({
      success: false,
      message: 'NarrativeID must be a positive integer.'
    });
  }

  if (SectionOrder !== undefined && (!Number.isInteger(SectionOrder) || SectionOrder <= 0)) {
    return res.status(400).json({
      success: false,
      message: 'SectionOrder must be a positive integer.'
    });
  }

  if (SectionHeading !== undefined && (typeof SectionHeading !== 'string' || SectionHeading.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      message: 'SectionHeading must be a non-empty string.'
    });
  }

  if (SectionBody !== undefined && (typeof SectionBody !== 'string' || SectionBody.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      message: 'SectionBody must be a non-empty string.'
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('SectionID', sql.Int, sectionId)
      .input('NarrativeID', sql.Int, NarrativeID || null)
      .input('SectionOrder', sql.Int, SectionOrder || null)
      .input('SectionHeading', sql.NVarChar(455), SectionHeading || null)
      .input('SectionBody', sql.NVarChar(sql.MAX), SectionBody || null)
      .execute('UpdateNarrativeSection');

    // Check if the section was found and updated
    if (result.recordset && result.recordset.length > 0) {
      const updatedSection = result.recordset[0];
      return res.status(200).json({
        success: true,
        message: 'Narrative section updated successfully.',
        data: {
          SectionID: updatedSection.SectionID,
          NarrativeID: updatedSection.NarrativeID,
          SectionOrder: updatedSection.SectionOrder,
          SectionHeading: updatedSection.SectionHeading,
          SectionBody: updatedSection.SectionBody,
          CreatedAt: updatedSection.CreatedAt,
          UpdatedAt: updatedSection.UpdatedAt
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Narrative section not found.'
      });
    }
  } catch (err) {
    console.error('Error updating narrative section:', err);
    
    // Handle specific database errors if needed
    if (err.number === 547) { // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        message: 'Invalid NarrativeID provided. The narrative does not exist.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update narrative section.',
      error: err.message
    });
  }
};

// Get all users without pagination
exports.getAllUsers = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().execute('GetAllUsers');

    const users = result.recordset;
    
    if (!users || users.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'No users found.',
        data: []
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: err.message });
  }
};

// Get user action plan narratives by UserID
exports.getUserActionPlanNarrativesByUserID = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'UserID is required.',
    });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('UserID', sql.UniqueIdentifier, userId)
      .execute('GetUserActionPlanNarrativesByUserID');

    if (!result || !result.recordset || result.recordset.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No narratives found for the given UserID.',
        data: [],
      });
    }

    const narratives = result.recordset;
    return res.status(200).json({
      success: true,
      message: 'Narratives retrieved successfully.',
      data: narratives,
    });
  } catch (err) {
    console.error('Error fetching narratives by UserID:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch narratives.',
      error: err.message,
    });
  }
};

// Create a new diet plan template
exports.createDietPlanTemplate = async (req, res) => {
  const { TemplateName, Description } = req.body;

  // Validate input
  if (!TemplateName || typeof TemplateName !== 'string' || TemplateName.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'TemplateName is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('TemplateName', sql.NVarChar(200), TemplateName)
      .input('Description', sql.NVarChar(500), Description || null)
      .execute('CreateDietPlanTemplate');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        success: true,
        message: 'Diet plan template created successfully',
        data: {
          DietPlanTemplateId: result.recordset[0].DietPlanTemplateId,
          Name: TemplateName,
          Description: Description || null
        }
      });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to create diet plan template' });
    }
  } catch (err) {
    console.error('Error creating diet plan template:', err);
    return res.status(500).json({ success: false, message: 'Failed to create diet plan template', error: err.message });
  }
};

// Get all diet plan templates
exports.getAllDietPlanTemplates = async (req, res) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().execute('GetAllDietPlanTemplates');
    // Parse AssignedUsers and Recipes fields from JSON string to array
    const templates = (result.recordset || []).map(template => {
      // Parse AssignedUsers
      if (typeof template.AssignedUsers === 'string' && template.AssignedUsers !== null) {
        try {
          template.AssignedUsers = JSON.parse(template.AssignedUsers);
        } catch {
          template.AssignedUsers = [];
        }
      }
      // Parse Recipes
      if (typeof template.Recipes === 'string' && template.Recipes !== null) {
        try {
          template.Recipes = JSON.parse(template.Recipes);
        } catch {
          template.Recipes = [];
        }
      }
      return template;
    });
    return res.status(200).json({
      success: true,
      message: 'Diet plan templates retrieved successfully',
      data: templates
    });
  } catch (err) {
    console.error('Error retrieving diet plan templates:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve diet plan templates', error: err.message });
  }
};

// Update a diet plan template
exports.updateDietPlanTemplate = async (req, res) => {
  const { id } = req.params;
  const { TemplateName, Description } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: 'DietPlanTemplateId is required.' });
  }
  if (!TemplateName || typeof TemplateName !== 'string' || TemplateName.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'TemplateName is required.' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('DietPlanTemplateId', sql.UniqueIdentifier, id)
      .input('TemplateName', sql.NVarChar(200), TemplateName)
      .input('Description', sql.NVarChar(500), Description || null)
      .execute('UpdateDietPlanTemplate');

    if (result.recordset && result.recordset.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Diet plan template updated successfully',
        data: {
          DietPlanTemplateId: result.recordset[0].DietPlanTemplateId,
          Name: TemplateName,
          Description: Description || null
        }
      });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to update diet plan template' });
    }
  } catch (err) {
    console.error('Error updating diet plan template:', err);
    return res.status(500).json({ success: false, message: 'Failed to update diet plan template', error: err.message });
  }
};

// Delete a diet plan template
exports.deleteDietPlanTemplate = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'DietPlanTemplateId is required.' });
  }
  try {
    const pool = await connectToDatabase();
    await pool.request()
      .input('DietPlanTemplateId', sql.UniqueIdentifier, id)
      .execute('DeleteDietPlanTemplate');
    return res.status(200).json({ success: true, message: 'Diet plan template deleted successfully.' });
  } catch (err) {
    console.error('Error deleting diet plan template:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete diet plan template', error: err.message });
  }
};

// Add a recipe to a diet plan template
exports.addRecipeToTemplate = async (req, res) => {
  const { DietPlanTemplateId, RecipeId, WeekNumber, DayOfWeek, MealType } = req.body;

  // Validate input
  if (!DietPlanTemplateId) {
    return res.status(400).json({ success: false, message: 'DietPlanTemplateId is required.' });
  }
  if (!RecipeId) {
    return res.status(400).json({ success: false, message: 'RecipeId is required.' });
  }
  if (!WeekNumber || typeof WeekNumber !== 'number' || WeekNumber < 1) {
    return res.status(400).json({ success: false, message: 'WeekNumber is required and must be a positive integer.' });
  }
  if (!DayOfWeek || typeof DayOfWeek !== 'number' || DayOfWeek < 1 || DayOfWeek > 7) {
    return res.status(400).json({ success: false, message: 'DayOfWeek is required and must be between 1 (Sunday) and 7 (Saturday).' });
  }
  if (!MealType || typeof MealType !== 'string') {
    return res.status(400).json({ success: false, message: 'MealType is required and must be a string (e.g., "Breakfast", "Lunch", "Dinner").' });
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('DietPlanTemplateId', sql.UniqueIdentifier, DietPlanTemplateId)
      .input('RecipeId', sql.UniqueIdentifier, RecipeId)
      .input('WeekNumber', sql.Int, WeekNumber)
      .input('DayOfWeek', sql.Int, DayOfWeek)
      .input('MealType', sql.NVarChar(50), MealType)
      .execute('AddRecipeToTemplate');

    if (result.recordset && result.recordset.length > 0 && result.recordset[0].Status === 'Success') {
      return res.status(201).json({
        success: true,
        message: 'Recipe added to diet plan template successfully',
        data: {
          DietPlanTemplateId,
          RecipeId,
          WeekNumber,
          DayOfWeek,
          MealType // Added MealType to response
        }
      });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to add recipe to diet plan template' });
    }
  } catch (err) {
    if (err.message && err.message.includes('Diet plan template not found')) {
      return res.status(404).json({ success: false, message: 'Diet plan template not found.' });
    }
    if (err.message && err.message.includes('Recipe not found')) {
      return res.status(404).json({ success: false, message: 'Recipe not found.' });
    }
    if (err.message && err.message.includes('A recipe is already assigned to this meal slot')) {
      return res.status(409).json({ success: false, message: 'A recipe is already assigned to this meal slot and meal type in the template.' });
    }
    console.error('Error adding recipe to diet plan template:', err);
    return res.status(500).json({ success: false, message: 'Failed to add recipe to diet plan template', error: err.message });
  }
};

// Assign a diet plan template to a user
exports.assignTemplateToUser = async (req, res) => {
  const { UserId, DietPlanTemplateId, StartDate, EndDate, IsActive } = req.body;

  // Validate input
  if (!UserId) {
    return res.status(400).json({ success: false, message: 'UserId is required.' });
  }
  if (!DietPlanTemplateId) {
    return res.status(400).json({ success: false, message: 'DietPlanTemplateId is required.' });
  }
  if (!StartDate) {
    return res.status(400).json({ success: false, message: 'StartDate is required.' });
  }
  if (!EndDate) {
    return res.status(400).json({ success: false, message: 'EndDate is required.' });
  }

  // Validate StartDate and EndDate format
  const startDateObj = new Date(StartDate);
  const endDateObj = new Date(EndDate);
  if (isNaN(startDateObj.getTime())) {
    return res.status(400).json({ success: false, message: 'StartDate must be a valid date.' });
  }
  if (isNaN(endDateObj.getTime())) {
    return res.status(400).json({ success: false, message: 'EndDate must be a valid date.' });
  }
  if (endDateObj < startDateObj) {
    return res.status(400).json({ success: false, message: 'EndDate cannot be before StartDate.' });
  }

  // Normalize IsActive to bit (default true)
  const isActiveBit = IsActive === undefined ? 1 : (IsActive ? 1 : 0);

  try {
    const pool = await connectToDatabase();

    // Handle both string and array inputs, and clean up the UUIDs
    const userIds = (Array.isArray(UserId) ? UserId : String(UserId).split(','))
      .map(id => id.trim().replace(/['"\[\]{}]/g, ''))
      .filter(id => id.length > 0);

    const results = [];
    const errors = [];

    for (const singleUserId of userIds) {
      try {
        // Basic UUID format validation
        if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(singleUserId)) {
          errors.push(`Invalid UserId format: ${singleUserId}`);
          continue;
        }

        const result = await pool.request()
          .input('UserId', sql.UniqueIdentifier, singleUserId)
          .input('DietPlanTemplateId', sql.UniqueIdentifier, DietPlanTemplateId)
          .input('StartDate', sql.Date, StartDate)
          .input('EndDate', sql.Date, EndDate)
          .input('IsActive', sql.Bit, isActiveBit)
          .execute('AssignTemplateToUser');

        if (result.recordset && result.recordset.length > 0) {
          const record = result.recordset[0];
          results.push({
            UserId: singleUserId,
            MemberDietPlanId: record.MemberDietPlanId,
            Weeks: record.Weeks,
            TotalDays: record.TotalDays,
            StartDate: record.StartDate,
            EndDate: record.EndDate,
            IsActive: record.IsActive !== undefined ? record.IsActive : isActiveBit,
            success: true
          });
        } else {
          errors.push(`Failed to assign template to user: ${singleUserId}`);
        }
      } catch (err) {
        // map common procedure messages to friendly errors
        if (err.message && err.message.includes('Cannot assign an empty template to a user')) {
          errors.push(`Cannot assign empty template to user: ${singleUserId}`);
        } else if (err.message && err.message.includes('This template is already assigned to the user')) {
          errors.push(`Template already assigned to user: ${singleUserId}`);
        } else if (err.message && err.message.includes('EndDate must be provided')) {
          errors.push(`Invalid EndDate for user ${singleUserId}: ${err.message}`);
        } else {
          errors.push(`Error for user ${singleUserId}: ${err.message}`);
        }
      }
    }

    if (results.length > 0) {
      return res.status(201).json({
        success: true,
        message: `Diet plan template assigned to ${results.length} user(s) successfully`,
        data: {
          successfulAssignments: results,
          failedAssignments: errors.length > 0 ? errors : undefined
        }
      });
    } else {
      return res.status(errors.some(e => e.includes('already assigned')) ? 409 : 500).json({
        success: false,
        message: 'Failed to assign diet plan template to any users',
        errors: errors
      });
    }

  } catch (err) {
    console.error('Error assigning diet plan template to user:', err);
    return res.status(500).json({ success: false, message: 'Failed to assign diet plan template to user', error: err.message });
  }
};
