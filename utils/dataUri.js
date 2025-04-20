const Datauri = require('datauri/parser');
const path = require('path');

const getDataUri = (file) => {
  // Validate the file object
  if (!file || !file.originalname || !file.buffer) {
    console.error('Invalid file object:', file);
    return null; // Return null or throw an error
  }

  const parser = new Datauri();
  const extName = path.extname(file.originalname).toString();

  try {
    // Format the file buffer into a data URI
    const dataUri = parser.format(extName, file.buffer);
    return dataUri;
  } catch (error) {
    console.error('Error during parser.format:', error);
    return null; // Return null or throw an error
  }
};

module.exports = getDataUri;