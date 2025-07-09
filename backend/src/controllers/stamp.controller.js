import Stamp from "../models/stamp.model.js";
import cloudinary from "../lib/cloudinary.js";


export const createStamp = async (req, res) => {
    try {
        const { title, country, year, category, description, image, isForSale, price, isMuseumPiece, availableQuantity } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!title || !country || !year || !category || !description || !image || price === undefined || availableQuantity === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "stamps",
            allowed_formats: ["jpg", "png", "webp"],
            transformation: [
                { width: 500, height: 500, crop: "limit" }
            ]
        });
        const imageUrl = uploadResponse.secure_url;

        const newStamp = new Stamp({
            title,
            country,
            year,
            category: Array.isArray(category) ? category : [category], // Ensure category is an array
            description,
            imageUrl,
            isForSale: isForSale || false,
            price,
            owner: userId,
            isMuseumPiece: isMuseumPiece || false,
            availableQuantity: availableQuantity || 1
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

        const stamp = await Stamp.findById(id);
        if (!stamp) {
            return res.status(404).json({ message: "Stamp not found" });
        }

        // Permission check
        if (req.user.type !== 'admin' && stamp.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You do not have permission to update this stamp" });
        }

        // Handle image update
        if (updates.image && updates.image !== stamp.imageUrl) {
            const imageURL = stamp.imageUrl;
            if (imageURL?.includes("/stamps/")) {
                const publicId = imageURL.split("/stamps/")[1]?.replace(/\.(jpg|jpeg|png|webp)$/, "");
                await cloudinary.uploader.destroy("stamps/" + publicId);
            }

            const uploadResponse = await cloudinary.uploader.upload(updates.image, {
                folder: "stamps",
                allowed_formats: ["jpg", "png", "webp"],
                transformation: [{ width: 500, height: 500, crop: "limit" }],
            });

            stamp.imageUrl = uploadResponse.secure_url;
        }

        // Update fields
        const updatableFields = [
            'title', 'country', 'year', 'description', 'isForSale',
            'price', 'availableQuantity', 'isMuseumPiece'
        ];

        updatableFields.forEach(field => {
            if (updates[field] !== undefined) {
                stamp[field] = updates[field];
            }
        });

        // Handle category separately
        if (updates.category) {
            stamp.category = Array.isArray(updates.category)
                ? updates.category
                : [updates.category];
        }

        const updatedStamp = await stamp.save();

        return res.status(200).json({
            message: "Stamp updated successfully",
            stamp: updatedStamp
        });
    } catch (error) {
        console.error("Error in updateStamp controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteStamp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const stamp = await Stamp.findById(id);
        if (!stamp) {
            return res.status(404).json({ message: "Stamp not found" });
        }
        if (req.user.type !== 'admin' && stamp.owner.toString() !== userId.toString()) {
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
        const isMuseumPiece = req.query.isMuseumPiece === "true";
        const search = req.query.search || "";
        const regexsearch = req.query.regexsearch || "";


        const filter = {
            ...(!!req.query.categories && { category: { $in: categories } }),
            ...(!!req.query.forSale && { isForSale: forSale }),
            ...(!!req.query.isMuseumPiece && { isMuseumPiece: isMuseumPiece }),
            ...(!!req.query.search && { $text: { $search: search } }),
            ...(!!req.query.regexsearch && {
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