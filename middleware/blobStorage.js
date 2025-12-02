const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error("Azure Storage connection string is not set in environment variables.");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

const containerName = 'emma-health-blob';

async function uploadFile(fileName, fileContent, mimeType) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists({ access: 'blob' });

        const uniqueFileName = `${Date.now()}-${fileName}`;
        const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);

        console.log("Uploading file:", uniqueFileName); // Log the file name
        await blockBlobClient.uploadData(fileContent, {
            blobHTTPHeaders: { blobContentType: mimeType }
        });

        console.log("File uploaded successfully:", blockBlobClient.url); // Log the URL
        return blockBlobClient.url;
    } catch (error) {
        console.error("Azure Blob upload failed:", error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
}

async function checkFileExists(fileName) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        return await blockBlobClient.exists();
    } catch (error) {
        console.error("Azure Blob check file existence failed:", error);
        throw new Error(`Failed to check file existence: ${error.message}`);
    }
}

async function deleteFile(fileName) {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.delete();
    } catch (error) {
        console.error("Azure Blob delete file failed:", error);
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}

module.exports = {
    uploadFile,
    checkFileExists,
    deleteFile
};