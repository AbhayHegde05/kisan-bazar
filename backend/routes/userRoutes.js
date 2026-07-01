const express = require("express");
const {
  getAllFarmers,
  getFarmerProfile,
  updateFarmerProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  verifyFarmer,
} = require("../controllers/userController");
const { addReview, getFarmerReviews } = require("../controllers/reviewController");
const { verifyToken, isAdmin, isFarmer } = require("../utils/authMiddleware");

const router = express.Router();

// Public routes
router.get("/farmers", getAllFarmers);
router.get("/farmers/:id", getFarmerProfile);

// Private routes
router.put("/profile", verifyToken, updateUserProfile);
router.put("/farmers/profile", verifyToken, isFarmer, updateFarmerProfile);

// Review routes
router.post("/farmers/:id/reviews", verifyToken, addReview);
router.get("/farmers/:id/reviews", getFarmerReviews);

// Admin routes
router.get("/", verifyToken, isAdmin, getAllUsers);
router.delete("/:id", verifyToken, isAdmin, deleteUser);
router.put("/farmers/:id/verify", verifyToken, isAdmin, verifyFarmer);

module.exports = router;
