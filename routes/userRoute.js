const express = require("express");
const {
  signup,
  login,
  updateProfile,
  logOut,
} = require("../controllers/userController");
const isAuthorized = require("../middleware/isAuthorized");
const { uploadFiles } = require("../middleware/multer");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logOut);
router.post("/profile/update", isAuthorized, uploadFiles,updateProfile);

module.exports = router;
