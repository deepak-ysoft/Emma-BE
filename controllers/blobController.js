const blobStorage = require("../middleware/blobStorage");
const validation = require("../common/validation");
const responseHandlers = require("../common/response");

// api to upload image
const uploadLogos = async (req, res) => {
  try {
    if (!req.file) {
      return responseHandlers.ValidationError(res, "File not uploaded");
    }

    const file = req.file;

    // Validate mimetype
    const mimeTypeError = validation.validateMimeType(file.mimetype);
    if (mimeTypeError) {
      return responseHandlers.ValidationError(res, mimeTypeError);
    }

    // Validate file size
    const fileSizeError = validation.validateFileSize(file.size);
    if (fileSizeError) {
      return responseHandlers.ValidationError(res, fileSizeError);
    }

    const imageUrl = await blobStorage.uploadFile(
      file.originalname,
      file.buffer,
      file.mimetype
    );
    console.log("imageUrl", imageUrl);
    return responseHandlers.SuccessResponseWithData(
      res,
      "Logo uploaded successfully",
      { imageUrl }
    );
  } catch (err) {
    console.error("Error uploading logo:", err);
    return responseHandlers.InternalServerError(res, err);
  }
};

const checkFileExists = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    // Ensure you pass the full unique name (timestamped) used during upload
    const exists = await blobStorage.checkFileExists(fileName);

    return responseHandlers.SuccessResponseWithData(
      res,
      "File existence status",
      { exists }
    );
  } catch (err) {
    return responseHandlers.InternalServerError(res, err);
  }
};

const deleteFile = async (req, res) => {
  try {
    const fileName = req.params.fileName;

    // Ensure you pass the full unique name (timestamped) used during upload
    await blobStorage.deleteFile(fileName);

    return responseHandlers.SuccessResponseWithOutData(
      res,
      "File deleted successfully"
    );
  } catch (err) {
    return responseHandlers.InternalServerError(res, err);
  }
};

module.exports = {
  uploadLogos,
  checkFileExists,
  deleteFile,
};
