import Stamp from "../models/stamp.model.js";
import User from "../models/user.model.js";


export const createStamp = async (req, res) => {
    try {
        const { title, country, year, category, description, imageUrl, isForSale, price, isMuseumPiece } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!title || !country || !year || !category || !description || !imageUrl || price === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newStamp = new Stamp({
            title,
            country,
            year,
            category,
            description,
            imageUrl,
            isForSale: isForSale || false,
            price,
            owner: userId,
            isMuseumPiece: isMuseumPiece || false
        });

        await newStamp.save();
        return res.status(201).json({
            message: "Stamp created successfully",
            stamp: newStamp
        });
    } catch (error) {
        console.error("Error in createStamp controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateStamp = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user._id;

        const updatedStamp = await Stamp.findByIdAndUpdate(
            id,
            { $set: updates, },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            message: "Stamp updated successfully",
            stamp: updatedStamp
        });
    } catch (error) {
        console.error("Error in updateStamp controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteStamp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const stamp = await Stamp.findById(id);
        if (!stamp) {
            return res.status(404).json({ message: "Stamp not found" });
        }
        if (stamp.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You do not have permission to delete this stamp" });
        }
        await Stamp.findByIdAndDelete(id);
        return res.status(200).json({ message: "Stamp deleted successfully" });
    } catch (error) {
        console.error("Error in deleteStamp controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllStamps = async (req, res) => {
    try {
        const categories = req.query.categories?.split(",");
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || "asc";
        const sortBy = req.query.sortBy || "createdAt";
        const forSale = req.query.forSale === "true";
        const isMuseumPiece = req.query.isMuseumPiece === "false";
        const search = req.query.search || "";
        const regexsearch = req.query.regexsearch || "";


        const filter = {
            ...(categories && { category: { $in: categories } }),
            ...(forSale && { isForSale: true }),
            ...(isMuseumPiece && { isMuseumPiece: true }),
            ...(search && { $text: { $search: search } }),
            ...(regexsearch && {
                $or: [
                    { title: { $regex: regexsearch, $options: "i" } },
                    { description: { $regex: regexsearch, $options: "i" } },
                    { country: { $regex: regexsearch, $options: "i" } }
                ]
            })
        }

        const stamps = await Stamp.find(filter)
            .sort({ [sortBy]: sort === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Stamp.countDocuments(filter);

        res.status(200).json({ totalItems: total, totalPages: Math.ceil(total / limit), page, stamps });
    } catch (error) {
        console.error("Error in getAllStamps controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getStampById = async (req, res) => {
    try {
        const { id } = req.params;
        const stamp = await Stamp.findById(id);
        if (!stamp) {
            return res.status(404).json({ message: "Stamp not found" });
        }
        res.status(200).json(stamp);
    } catch (error) {
        console.error("Error in getStampById controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};