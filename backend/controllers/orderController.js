const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const { generateInvoice } = require("../utils/invoiceGenerator");

// @desc    Create an order
// @route   POST /api/orders
// @access  Private (Consumer only)
exports.createOrder = async (req, res, next) => {
  try {
    const { farmer, items, pickupDetails, deliveryDetails, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items cannot be empty"
      });
    }

    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for product ${product.name}`
        });
      }

      if (product.quantityAvailable < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough quantity available for ${product.name}`
        });
      }

      let price = product.price;
      if (product.isOrganic && product.price > 100) {
        price = price * 0.95;
      }

      if (
        product.bulkDiscount &&
        product.bulkDiscount.threshold > 0 &&
        item.quantity >= product.bulkDiscount.threshold
      ) {
        const discountAmount =
          (price * product.bulkDiscount.discountPercent) / 100;
        price -= discountAmount;
      }

      totalAmount += price * item.quantity;
      item.price = price;

      product.quantityAvailable -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      consumer: req.user._id,
      farmer,
      items,
      totalAmount,
      pickupDetails,
      deliveryDetails,
      notes,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// @desc    Get consumer orders
// @route   GET /api/orders/consumer
// @access  Private (Consumer only)
exports.getConsumerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user._id })
      .populate("farmer", "name")
      .populate({
        path: "items.product",
        select: "name images",
      })
      .sort("-createdAt");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer orders
// @route   GET /api/orders/farmer
// @access  Private (Farmer only)
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate("consumer", "name")
      .populate({
        path: "items.product",
        select: "name images",
      })
      .sort("-createdAt");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("consumer", "name email phone")
      .populate("farmer", "name email phone")
      .populate({
        path: "items.product",
        select: "name images",
      });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      order.consumer._id.toString() !== req.user._id.toString() &&
      order.farmer._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to view this order" });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Farmer or Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      order.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("consumer", "name")
      .populate("farmer", "name")
      .sort("-createdAt");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get order invoice
// @route   GET /api/orders/:id/invoice
// @access  Private
exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("consumer", "name email")
      .populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Authorization check
    if (
      order.consumer._id.toString() !== req.user._id.toString() &&
      order.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    generateInvoice(order, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
