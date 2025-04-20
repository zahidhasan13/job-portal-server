const express = require("express");
const isAuthorized = require("../middleware/isAuthorized");
const {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
} = require("../controllers/applicationController");

const router = express.Router();

router.get("/apply/:id", isAuthorized, applyJob);
router.get("/", isAuthorized, getAppliedJobs);
router.get("/:id/applicant", isAuthorized, getApplicants);
router.post("/status/:id/update", isAuthorized, updateStatus);

module.exports = router;
