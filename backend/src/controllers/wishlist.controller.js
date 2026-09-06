import Stamp from "../models/stamp.model.js";
import User from "../models/user.model.js";

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: 'wishlist',
            select: 'title country year category condition description imageUrl isForSale price isMuseumPiece availableQuantity'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out any null entries in case a stamp was deleted from the database
        const validWishlist = (user.wishlist || []).filter(item => item !== null);

        res.status(200).json({ wishlist: validWishlist });
    } catch (error) {
        console.error("Error in getWishlist controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleWishlist = async (req, res) => {
    try {
        const { stampId } = req.body;
        const user = req.user;

        if (!stampId) {
            return res.status(400).json({ message: "Stamp ID is required" });
        }

        const stamp = await Stamp.findById(stampId);
        if (!stamp) {
            return res.status(404).json({ message: "Stamp not found" });
        }

        user.wishlist = user.wishlist || [];

        const existsIndex = user.wishlist.findIndex(id => id.toString() === stampId.toString());
        let isWishlisted = false;

        if (existsIndex > -1) {
            // Remove from wishlist
            user.wishlist.splice(existsIndex, 1);
            isWishlisted = false;
        } else {
            // Add to wishlist
            user.wishlist.push(stampId);
            isWishlisted = true;
        }

        await user.save();

        res.status(200).json({
            message: isWishlisted ? "Added to wishlist" : "Removed from wishlist",
            isWishlisted,
            wishlistCount: user.wishlist.length,
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error("Error in toggleWishlist controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { stampId } = req.params;
        const user = req.user;

        if (!stampId) {
            return res.status(400).json({ message: "Stamp ID is required" });
        }

        user.wishlist = (user.wishlist || []).filter(id => id.toString() !== stampId.toString());
        await user.save();

        res.status(200).json({
            message: "Removed from wishlist successfully",
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error("Error in removeFromWishlist controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
