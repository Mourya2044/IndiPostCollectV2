import Review from "../models/review.model.js";
import Stamp from "../models/stamp.model.js";
import Order from "../models/order.model.js";

export const getStampReviews = async (req, res) => {
    try {
        const { stampId } = req.params;

        const reviews = await Review.find({ stamp: stampId })
            .populate("user", "fullName profilePic")
            .sort({ createdAt: -1 });

        const totalReviews = reviews.length;
        let sumRating = 0;
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        reviews.forEach(r => {
            sumRating += r.rating;
            if (distribution[r.rating] !== undefined) {
                distribution[r.rating]++;
            }
        });

        const avgRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : 0;

        res.status(200).json({
            reviews,
            stats: {
                totalReviews,
                avgRating: Number(avgRating),
                distribution
            }
        });
    } catch (error) {
        console.error("Error in getStampReviews:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addOrUpdateReview = async (req, res) => {
    try {
        const { stampId } = req.params;
        const { rating, conditionAssessment, headline, comment } = req.body;
        const userId = req.user._id;

        if (!rating || !headline || !comment) {
            return res.status(400).json({ message: "Rating, headline, and comments are required" });
        }

        const stamp = await Stamp.findById(stampId);
        if (!stamp) {
            return res.status(404).json({ message: "Stamp not found" });
        }

        // Verify if user is a verified buyer
        const hasPurchased = await Order.exists({
            userId,
            status: "complete",
            "items.productId": stampId
        });

        const review = await Review.findOneAndUpdate(
            { stamp: stampId, user: userId },
            {
                rating: Number(rating),
                conditionAssessment: conditionAssessment || "Mint Never Hinged (MNH)",
                headline: headline.trim(),
                comment: comment.trim(),
                verifiedBuyer: Boolean(hasPurchased)
            },
            { new: true, upsert: true, runValidators: true }
        ).populate("user", "fullName profilePic");

        res.status(200).json({
            message: "Review submitted successfully",
            review
        });
    } catch (error) {
        console.error("Error in addOrUpdateReview:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== userId.toString() && req.user.type !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error in deleteReview:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
