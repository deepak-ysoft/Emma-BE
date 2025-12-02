// Function to validate the MIME type of the uploaded file
const validateMimeType = (mimeType) => {
    // Define allowed MIME types for images
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

    // Check if the provided MIME type is in the allowed list
    if (!allowedMimeTypes.includes(mimeType)) {
        return 'Invalid file type. Only JPEG, PNG, and GIF are allowed.';
    }

    return null;
};

// Function to validate the file size of the uploaded file
const validateFileSize = (size) => {
    // Define the maximum allowed file size (5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    // Check if the file size exceeds the limit
    if (size > maxSizeInBytes) {
        return 'File size exceeds the maximum limit of 5MB.';
    }

    return null;
};

module.exports = {
    validateMimeType,
    validateFileSize
};
