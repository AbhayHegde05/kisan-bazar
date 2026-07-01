const Review = require("../models/ReviewModel");
const FarmerProfile = require("../models/FarmerProfileModel");
const User = require("../models/UserModel");

// @desc    Add a review for a farmer
// @route   POST /api/users/farmers/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const farmerId = req.params.id; // Corrected: This is the Farmer's User ID

        // Validate if farmer exists and is a farmer
        const farmerUser = await User.findById(farmerId);
        if (!farmerUser || farmerUser.role !== "farmer") {
            return res.status(404).json({ success: false, message: "Farmer not found" });
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            farmer: farmerId,
        });

        if (alreadyReviewed) {
            return res
                .status(400)
                .json({ success: false, message: "You have already reviewed this farmer" });
        }

        const review = await Review.create({
            rating: Number(rating),
            comment,
            user: req.user._id,
            farmer: farmerId,
        });

        // Calculate new average rating
        const reviews = await Review.find({ farmer: farmerId });
        const numReviews = reviews.length;
        const averageRating =
            reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        // Update Farmer Profile
        const profile = await FarmerProfile.findOne({ user: farmerId });
        if (profile) {
            profile.numReviews = numReviews;
            profile.averageRating = averageRating;
            await profile.save();
        } else {
            // Should exist, but handle edge case
            await FarmerProfile.create({
                user: farmerId,
                numReviews,
                averageRating,
                farmName: `${farmerUser.name}'s Farm`,
                description: "Auto-generated profile."
            });
        }

        res.status(201).json({ success: true, message: "Review added", review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// @desc    Get reviews for a farmer
// @route   GET /api/users/farmers/:id/reviews
// @access  Public
exports.getFarmerReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ farmer: req.params.id })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
