const User = require("../models/UserModel");
const FarmerProfile = require("../models/FarmerProfileModel");

// @desc    Get all farmers
// @route   GET /api/users/farmers
// @access  Public
exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" }).select("-password");

    // Fetch profiles for these farmers
    const farmerIds = farmers.map(farmer => farmer._id);
    const profiles = await FarmerProfile.find({ user: { $in: farmerIds } });

    // Merge profile data into farmer object
    const farmersWithProfiles = farmers.map(farmer => {
      const profile = profiles.find(p => p.user.toString() === farmer._id.toString());
      return {
        ...farmer.toObject(),
        profile: profile || {}
      };
    });

    res.json({
      success: true,
      count: farmersWithProfiles.length,
      data: farmersWithProfiles,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer profile
// @route   GET /api/users/farmers/:id
// @access  Public
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findOne({
      _id: req.params.id,
      role: "farmer",
    }).select("-password");

    if (!farmer) {
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    }

    const farmerProfile = await FarmerProfile.findOne({ user: req.params.id });

    res.json({
      success: true,
      data: {
        farmer,
        profile: farmerProfile || {},
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create or update farmer profile
// @route   PUT /api/users/farmers/profile
// @access  Private (Farmer only)
exports.updateFarmerProfile = async (req, res) => {
  try {
    const {
      farmName,
      description,
      farmImages,
      farmingPractices,
      establishedYear,
      socialMedia,
      businessHours,
      acceptsPickup,
      acceptsDelivery,
      deliveryRadius,
    } = req.body;

    const profileFields = {
      user: req.user._id,
      farmName,
      description,
      farmImages,
      farmingPractices,
      establishedYear,
      socialMedia,
      businessHours,
      acceptsPickup,
      acceptsDelivery,
      deliveryRadius,
    };

    let farmerProfile = await FarmerProfile.findOne({ user: req.user._id });

    if (farmerProfile) {
      farmerProfile = await FarmerProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      farmerProfile = await FarmerProfile.create(profileFields);
    }

    res.json({
      success: true,
      data: farmerProfile,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // Enhance users with farmer profile data if they are farmers
    const enhancedUsers = await Promise.all(
      users.map(async (user) => {
        if (user.role === "farmer") {
          const profile = await FarmerProfile.findOne({ user: user._id });
          return { ...user.toObject(), profile: profile || {} };
        }
        return user.toObject();
      })
    );

    res.json({
      success: true,
      count: enhancedUsers.length,
      data: enhancedUsers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.remove();

    res.json({
      success: true,
      message: "User removed",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Verify farmer (admin only)
// @route   PUT /api/users/farmers/:id/verify
// @access  Private (Admin only)
exports.verifyFarmer = async (req, res) => {
  try {
    const farmerProfile = await FarmerProfile.findOne({ user: req.params.id });

    if (!farmerProfile) {
      return res.status(404).json({ success: false, message: "Farmer profile not found" });
    }

    farmerProfile.isVerified = !farmerProfile.isVerified;
    await farmerProfile.save();

    res.json({
      success: true,
      message: `Farmer ${farmerProfile.isVerified ? "verified" : "unverified"}`,
      data: farmerProfile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
