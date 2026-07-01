const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    unit: {
      type: String,
      required: [true, "Please add a unit (e.g., lb, kg, bunch)"],
    },
    quantityAvailable: {
      type: Number,
      required: [true, "Please add available quantity"],
    },
    images: [String],
    isOrganic: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    harvestDate: Date,
    availableUntil: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    bulkDiscount: {
      threshold: {
        type: Number,
        default: 0, // 0 means no bulk discount
      },
      discountPercent: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
