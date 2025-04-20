const Company = require("../models/companySchema");
const Job = require("../models/jobSchema");

const jobPost = async (req, res) => {
  try {
    const { title, companyId, description, requirements, location, salary, employmentType, skills } = req.body;
    console.log(companyId);
    
    // Validate required fields
    if (!title || !companyId) {
      return res.status(400).json({ 
        success: false,
        error: "Title and company ID are required fields" 
      });
    }

    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ 
        success: false,
        error: "Company not found" 
      });
    }

    // Create job post
    const newJob = await Job.create({
      title,
      company: companyId,
      postedBy: req.user?.id || req.id, 
    });

    // Populate company details in the response
    const populatedJob = await Job.findById(newJob._id)
      .populate({
        path: "company", // Only include necessary fields
      })

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      populatedJob
    });
  } catch (error) {
    console.error("Job posting error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "An error occurred while posting the job" 
    });
  }
};
// search Jobs
const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      throw new Error("Job not Found!");
    }
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get job by id
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({
        path: "applications",
        model: "Application"
      })
      .populate({
        path: "company",  // assuming the field in Job model is 'company'
        model: "Company"
      });
      
    if (!job) {
      throw new Error("Job not Found!");
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get admin posted jobs
const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    if (!adminId) {
      throw new Error("Id invalid");
    }
    const jobs = await Job.find({ postedBy: adminId }).populate({
      path: "company",
      createdAt: -1,
    });
    if (!jobs) {
      throw new Error("Job not Found!");
    }
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Job Update
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      title,
      company,
      location,
      responsibilities,
      requirements,
      employmentType,
      industry,
      experienceLevel,
      salaryMin,
      salaryMax,
      skills,
      applicationDeadline,
      contactEmail,
    } = req.body;

    const update = {
      title,
      company,
      location,
      responsibilities,
      requirements,
      employmentType,
      industry,
      experienceLevel,
      salary: {
        min: salaryMin,
        max: salaryMax,
      },
      skills,
      applicationDeadline,
      contactEmail,
    };

    const job = await Job.findByIdAndUpdate(jobId, update, {
      new: true,
    });
    if (!job) {
      throw new Error("Job not Found!");
    }
    res.status(200).json({
      company,
      message: "Job Updated Successfully!",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the company exists
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Delete the company
    await Job.findByIdAndDelete(id);

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = {
  jobPost,
  getAllJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteJob,
};
