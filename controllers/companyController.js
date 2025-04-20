const Company = require("../models/companySchema");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("../utils/cloudinary");

const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      throw new Error("Company name rquired!");
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      throw new Error("This Company Already Registerd!");
    }

    company = await Company.create({
      name: companyName,
      createdBy: req.id,
    });
    res
      .status(200)
      .json({ message: "Company Create Successful!", success: true, company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Company
const getCompanies = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ createdBy: userId });
    if (!companies) {
      throw new Error("No companies Found!");
    }
    res.status(200).json(companies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Single Company
const gestSingleCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      throw new Error("No company Found!");
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Company
const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const companyLogoFile = req.file;
    const {
      name,
      description,
      industry,
      companySize,
      foundedYear,
      website,
      address,
      city,
      state,
      country,
      zipCode,
      isHeadquarters,
      linkedin,
      twitter,
      facebook,
      instagram,
      contactEmail,
      contactPhone,
      isVerified,
    } = req.body;

    // Upload company logo to Cloudinary
    let companyLogos;
    if (companyLogoFile) {
      const companyLogoUri = getDataUri(companyLogoFile);
      const companyLogoRes = await cloudinary.uploader.upload(
        companyLogoUri.content,
        {
          folder: "logo", // Optional: Organize files in Cloudinary
        }
      );
      companyLogos = companyLogoRes.secure_url;
    }
    const update = {
      name,
      description,
      logo: companyLogos,
      industry,
      companySize,
      foundedYear,
      website,
      locations: {
        address,
        city,
        state,
        country,
        zipCode,
        isHeadquarters,
      },
      socialMedia: {
        linkedin,
        twitter,
        facebook,
        instagram,
      },
      contactEmail,
      contactPhone,
      isVerified,
    };

    const company = await Company.findByIdAndUpdate(companyId, update, {
      new: true,
    });
    if (!company) {
      throw new Error("Company not Found!");
    }
    res.status(200).json({
      company,
      message: "Company Updated Successfully!",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Company
const deleteCompany = async (req, res) => {
  const { id } = req.params; // Get the company ID from the request parameters

  try {
    // Check if the company exists
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Delete the company
    await Company.findByIdAndDelete(id);

    // Send success response
    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  registerCompany,
  getCompanies,
  gestSingleCompany,
  updateCompany,
  deleteCompany
};
