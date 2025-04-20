const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["jobseeker", "recruiter", "admin"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      description: { type: String },
      address:{type:String},
      resume: { type: String },
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

// Signup
userSchema.statics.signup = async function (
  name,
  email,
  password,
  phone,
  role
) {
  if (!name || !email || !password || !phone || !role) {
    throw new Error("All fields are required!");
  }
  // Validation
  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long, include uppercase, lowercase, numbers, and special characters."
    );
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw new Error("This Email Already Used!");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await this.create({
    name,
    email,
    password: hashPassword,
    phone,
    role,
  });

  return user;
};

// Login
userSchema.statics.login = async function (email, password, role) {
  if (!email || !password || !role) {
    throw new Error("All fields are required!");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("Invalid Email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Incorrect Password");
  }
  if (role !== user.role) {
    throw new Error("Account doesn't exist with current role");
  }

  return user;
};


module.exports = mongoose.model("User", userSchema);
