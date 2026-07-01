const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // References the Farmer's User ID (not Profile ID usually, consistent with other refs)
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Review", ReviewSchema);
