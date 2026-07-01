const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Farmer only)
exports.createProduct = async (req, res) => {
  try {
    req.body.farmer = req.user._id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const query = {};

    // Search filter by name and description
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.farmer) {
      query.farmer = req.query.farmer;
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Organic filter
    if (req.query.isOrganic === "true") {
      query.isOrganic = true;
    }

    // Rating filter
    if (req.query.rating) {
      query.averageRating = { $gte: Number(req.query.rating) };
    }

    query.isActive = true;

    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-asc":
          sort = { price: 1 };
          break;
        case "price-desc":
          sort = { price: -1 };
          break;
        case "name-asc":
          sort = { name: 1 };
          break;
        case "newest":
          sort = { createdAt: -1 };
          break;
        case "rating":
          sort = { averageRating: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("farmer", "name")
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("farmer", "name")
      .populate("category", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Make sure user is the product owner
    if (
      product.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await product.remove();

    res.json({
      success: true,
      message: "Product removed",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Seed products
// @route   POST /api/products/seed
// @access  Private (Admin only)
exports.seedProducts = async (req, res) => {
  try {
    const products = [
      {
        farmer: "60f1b4b0b5b5b4a0b4b0b0b0",
        name: "Organic Tomatoes",
        description: "Fresh, juicy organic tomatoes, grown locally.",
        category: "60f1b4b0b5b5b4a0b4b0b0b1",
        price: 150,
        unit: "kg",
        quantityAvailable: 100,
        images: ["/images/tomatoes.jpg"],
        isOrganic: true,
      },
      {
        farmer: "60f1b4b0b5b5b4a0b4b0b0b0",
        name: "Fresh Spinach",
        description: "Leafy green spinach, rich in iron.",
        category: "60f1b4b0b5b5b4a0b4b0b0b1",
        price: 80,
        unit: "bunch",
        quantityAvailable: 200,
        images: ["/images/spinach.jpg"],
        isOrganic: true,
      },
      {
        farmer: "60f1b4b0b5b5b4a0b4b0b0b2",
        name: "Potatoes",
        description: "High-quality potatoes, perfect for any dish.",
        category: "60f1b4b0b5b5b4a0b4b0b0b1",
        price: 50,
        unit: "kg",
        quantityAvailable: 500,
        images: ["/images/potatoes.jpg"],
      },
      {
        farmer: "60f1b4b0b5b5b4a0b4b0b0b2",
        name: "Onions",
        description: "Fresh onions, a staple for Indian cooking.",
        category: "60f1b4b0b5b5b4a0b4b0b0b1",
        price: 60,
        unit: "kg",
        quantityAvailable: 400,
        images: ["/images/onions.jpg"],
      },
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);

    res.status(201).json({
      success: true,
      message: "Products seeded successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer products
// @route   GET /api/products/farmer
// @access  Private (Farmer only)
exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).populate(
      "category",
      "name"
    );

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
