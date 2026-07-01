const User = require("../models/UserModel");
const FarmerProfile = require("../models/FarmerProfileModel");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, verificationDetails, farmName } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      address,
    });

    if (user) {
      // Create Farmer Profile if role is farmer
      if (role === "farmer") {
        await FarmerProfile.create({
          user: user._id,
          farmName: farmName || `${name}'s Farm`,
          description: "Description pending...",
          verificationDetails: verificationDetails || {},
          isVerified: false // Default to false until admin approves
        });
      }

      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check verification status if farmer
    let isVerified = false;
    if (user.role === "farmer") {
      const profile = await FarmerProfile.findOne({ user: user._id });
      if (profile) {
        isVerified = profile.isVerified;
      }
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        isVerified: user.role === "farmer" ? isVerified : true // Consumers are auto-verified
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Google OAuth Login
// @route   POST /api/auth/google-login
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res
        .status(400)
        .json({ success: false, message: "Google token is required" });
    }

    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${tokenId}`);
      const { email, name, picture, sub } = response.data;

      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required from Google" });
      }

      let user = await User.findOne({ email });

      if (!user) {
        // Create new user account
        const randomPassword = Math.random().toString(36).slice(-8);
        user = await User.create({
          name,
          email,
          password: randomPassword,
          role: "consumer", // Default role for Google signups
          phone: "",
          address: {},
          isVerified: true,
        });
      }

      // Create Farmer Profile if user is farmer
      if (user.role === "farmer") {
        const profileExists = await FarmerProfile.findOne({ user: user._id });
        if (!profileExists) {
          await FarmerProfile.create({
            user: user._id,
            farmName: `${name}'s Farm`,
            description: "Description pending...",
            verificationDetails: {},
            isVerified: false,
          });
        }
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          isVerified: user.role === "farmer" ? user.isVerified : true,
        },
        token,
      });
    } catch (googleError) {
      console.error("Google token validation error:", googleError);
      return res.status(400).json({ success: false, message: "Invalid Google token" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
