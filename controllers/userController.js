const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("../utils/cloudinary");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
};

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    let user = await User.signup(name, email, password, phone, role);
    user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile: user.profile,
    };
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let user = await User.login(email, password, role);
    const token = createToken(user._id);
    user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile: user.profile,
    };
    res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Logout
const logOut = async (req, res) => {
  try {
    res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout Successful",
    });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};

// update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, bio, skills, description, address } = req.body;
    const profilePhotoFile = req.files['profilePhoto'] ? req.files['profilePhoto'][0] : null;
    console.log(profilePhotoFile);
    const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;
    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(401).json("User Not Found!");
    }
    let skillsArray;
    if(skills){
      skillsArray = skills.split(",");
      // skillsArray = skillsArray.map((skill) => skill.trim());
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;
    if (description) user.profile.description = description;
    if (address) user.profile.address = address;

    // Upload profile photo to Cloudinary
    if (profilePhotoFile) {
      const profilePhotoUri = getDataUri(profilePhotoFile);
      const profilePhotoRes = await cloudinary.uploader.upload(profilePhotoUri.content, {
        folder: 'profile-photos', // Optional: Organize files in Cloudinary
      });
      user.profile.profilePhoto = profilePhotoRes.secure_url;
    }

    // Upload resume to Cloudinary
    if (resumeFile) {
      const resumeUri = getDataUri(resumeFile);
      const resumeRes = await cloudinary.uploader.upload(resumeUri.content, {
        folder: 'resumes', // Optional: Organize files in Cloudinary
      });
      user.profile.resume = resumeRes.secure_url;
      user.profile.resumeOriginalName = resumeFile.originalname;
    }

    await user.save();

    // Return updated user data
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile: user.profile,
    };

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logOut,
  updateProfile,
};
