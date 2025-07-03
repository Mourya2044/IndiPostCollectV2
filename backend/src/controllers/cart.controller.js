import User from "../models/user.model.js";
import Stamp from "../models/stamp.model.js";

export const addToCart = async (req, res) => {
    try {        
        const { stampId, quantity } = req.body;
        // const userId = req.user._id;

        if (!stampId || quantity == null) {
            return res.status(400).json({ message: "Stamp ID and quantity are required" });
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ message: "Quantity must be a positive integer" });
        }

        const stamp = await Stamp.findById(stampId);
        if (!stamp) {
            return res.status(404).json({ message: "Stamp not found" });
        }

        // let user = await User.findById(userId).select("-password");
        let user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cart = user.cart || [];

        let existingItem = user.cart.find(item => item.productId.toString() === stampId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ productId: stampId, quantity });
        }

        await user.save();

        res.status(200).json({ message: "Item added to cart successfully", cart: user.cart });
    } catch (error) {
        console.error("Error in addToCart controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {        
        const { stampId, quantity } = req.body;
        // const userId = req.user._id;

        if (!stampId || quantity == null) {
            return res.status(400).json({ message: "Stamp ID and quantity are required" });
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ message: "Quantity must be a positive integer" });
        }

        // let user = await User.findById(userId).select("-password");
        let user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let existingItem = user.cart.find(item => item.productId.toString() === stampId);

        if (!existingItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const q = Math.max(0, existingItem.quantity - quantity);
        if(q<1) {
            const items = user.cart.filter(item => item != existingItem);
            user.cart = items;
        } else {
            existingItem.quantity -= q;
        }

        await user.save();

        res.status(200).json({ message: "Item removed from cart successfully", cart: user.cart });
    } catch (error) {
        console.error("Error in removeFromCart controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const user = req.user;
        
        user.cart = [];
        await user.save();

        res.status(200).json({ message: "Cart cleared successfully", cart: user.cart })
    } catch (error) {
        console.error("Error in clearCart controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCart = async (req, res) => {
    try {
        // const userId = req.user._id;

        // const user = await User.findById(userId).select("-password");
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        console.error("Error in getCart controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

