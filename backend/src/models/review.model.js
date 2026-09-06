import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    stamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stamp",
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    conditionAssessment: {
        type: String,
        enum: [
            "Mint Never Hinged (MNH)",
            "Mint Lightly Hinged (MLH)",
            "Used (Superb/Fine)",
            "Used (Good)",
            "First Day Cover (FDC)"
        ],
        default: "Mint Never Hinged (MNH)"
    },
    headline: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1500
    },
    verifiedBuyer: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Prevent duplicate reviews per user per stamp
reviewSchema.index({ stamp: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
