const express = require("express");
const isAuthorized = require("../middleware/isAuthorized");
const { jobPost, getJobById, getAllJobs, getAdminJobs, updateJob, deleteJob } = require("../controllers/jobController");

const router = express.Router();

router.post("/",isAuthorized,jobPost)
router.get("/",getAllJobs)
router.get("/adminJobs",isAuthorized,getAdminJobs)
router.get("/:id",isAuthorized,getJobById)
router.patch("/:id",isAuthorized,updateJob)
router.delete("/delete/:id",isAuthorized,deleteJob)

module.exports = router;
