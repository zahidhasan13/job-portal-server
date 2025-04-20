const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFiles = upload.fields([
  { name: 'profilePhoto', maxCount: 1 }, // For profile photo
  { name: 'resume', maxCount: 1 }, // For resume
]);
const companyLogo = upload.single('logo');

module.exports = {
  uploadFiles,
  companyLogo
};