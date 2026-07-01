const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  seedProducts,
} = require("../controllers/productController");
const { verifyToken, isFarmer, isAdmin } = require("../utils/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProduct);

// Farmer routes
router.post("/", verifyToken, isFarmer, createProduct);
router.put("/:id", verifyToken, isFarmer, updateProduct);
router.delete("/:id", verifyToken, isFarmer, deleteProduct);
router.get("/farmer/me", verifyToken, isFarmer, getFarmerProducts);

// Admin routes
router.post("/seed", verifyToken, isAdmin, seedProducts);

module.exports = router;
