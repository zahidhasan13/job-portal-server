const Application = require("../models/applicationSchema");
const Job = require("../models/jobSchema");
const mongoose = require("mongoose");

const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    console.log(userId);
    const jobId = req.params.id;

    // Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID." });
    }

    // Check if the user has already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job." });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // Add the application to the job's applications array
    job.applications.push(newApplication._id);
    await job.save();

    // Return the new application
    res
      .status(201)
      .json({
        message: "Job applied successfully!",
        application: newApplication,
      });
  } catch (error) {
    console.error("Error applying for job:", error);
    res
      .status(500)
      .json({ error: "An error occurred while applying for the job." });
  }
};
// get Applied jobs
const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId }).populate({
      path: "job",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "company",
        options: { sort: { createdAt: -1 } },
      },
    });

    if (!application) {
      return res.status(404).json({ message: "No Applications!" });
    }
    res.status(200).json({ application });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// how many apply in particular job
const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path: "applications", 
        options: { sort: { createdAt: -1 } }, 
        populate: {
          path: "applicant",
        },
      });
    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }
    res.status(200).json({ job });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    console.log(applicationId);
    if (!status) {
      return res.status(404).json({ message: "Status is required!" });
    }

    const application = await Application.findById({ _id: applicationId });
    if (!application) {
      return res.status(404).json({ message: "Application not found!" });
    }

    // update
    application.status = status.toLowerCase();
    await application.save();
    res.status(200).json({ message: "Status Update Successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
};
