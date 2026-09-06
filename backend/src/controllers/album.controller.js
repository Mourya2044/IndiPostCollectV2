import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Stamp from "../models/stamp.model.js";

export const getAlbum = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch user document with explicit album
        const user = await User.findById(userId).populate({
            path: 'album.stamp',
            select: 'title country year category condition description imageUrl price isMuseumPiece'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.album = user.album || [];

        // 2. Fetch completed orders to auto-populate purchased stamps
        const completedOrders = await Order.find({
            userId,
            status: 'complete'
        }).populate({
            path: 'items.productId',
            select: 'title country year category condition description imageUrl price isMuseumPiece'
        });

        // 3. Collect all stamps and deduplicate
        const stampMap = new Map();

        // First add manually mounted album stamps
        user.album.forEach(item => {
            if (item.stamp && item.stamp._id) {
                const idStr = item.stamp._id.toString();
                stampMap.set(idStr, {
                    _id: item._id || idStr,
                    stamp: item.stamp,
                    acquiredDate: item.acquiredDate || item.createdAt || new Date(),
                    notes: item.notes || '',
                    source: item.source || 'Manual Entry'
                });
            }
        });

        // Next incorporate stamps from completed orders if not already mounted
        completedOrders.forEach(order => {
            order.items.forEach(orderItem => {
                const stamp = orderItem.productId;
                if (stamp && stamp._id) {
                    const idStr = stamp._id.toString();
                    if (!stampMap.has(idStr)) {
                        stampMap.set(idStr, {
                            _id: `order-${order._id}-${idStr}`,
                            stamp,
                            acquiredDate: order.createdAt,
                            notes: `Acquired via Order #${order.orderId || order._id.toString().slice(-6).toUpperCase()}`,
                            source: 'Verified Purchase'
                        });
                    }
                }
            });
        });

        const albumItems = Array.from(stampMap.values());

        // 4. Calculate collection stats
        let totalValue = 0;
        const categoriesSet = new Set();
        let earliestYear = null;
        let latestYear = null;
        const eraBreakdown = {
            'Classic / Pre-1947': 0,
            'Early Republic (1947–1975)': 0,
            'Modern (1976–2000)': 0,
            '21st Century (2001+)': 0
        };

        albumItems.forEach(item => {
            const s = item.stamp;
            if (s.price) totalValue += Number(s.price);
            if (Array.isArray(s.category)) {
                s.category.forEach(c => categoriesSet.add(c));
            }
            if (s.year) {
                if (earliestYear === null || s.year < earliestYear) earliestYear = s.year;
                if (latestYear === null || s.year > latestYear) latestYear = s.year;

                if (s.year < 1947) eraBreakdown['Classic / Pre-1947']++;
                else if (s.year <= 1975) eraBreakdown['Early Republic (1947–1975)']++;
                else if (s.year <= 2000) eraBreakdown['Modern (1976–2000)']++;
                else eraBreakdown['21st Century (2001+)']++;
            }
        });

        const stats = {
            totalStamps: albumItems.length,
            totalEstimatedValue: totalValue,
            uniqueThemes: categoriesSet.size,
            earliestYear: earliestYear || 'N/A',
            latestYear: latestYear || 'N/A',
            eraBreakdown
        };

        res.status(200).json({
            album: albumItems,
            stats
        });
    } catch (error) {
        console.error("Error in getAlbum controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const mountStampToAlbum = async (req, res) => {
    try {
        const { stampId, notes, source } = req.body;
        const user = req.user;

        if (!stampId) {
            return res.status(400).json({ message: "Stamp ID is required" });
        }

        const stamp = await Stamp.findById(stampId);
        if (!stamp) {
            return res.status(404).json({ message: "Stamp not found" });
        }

        user.album = user.album || [];

        const exists = user.album.some(item => item.stamp.toString() === stampId.toString());
        if (exists) {
            return res.status(400).json({ message: "Stamp is already mounted in your virtual album" });
        }

        user.album.push({
            stamp: stampId,
            acquiredDate: new Date(),
            notes: notes || "",
            source: source || "Collector Mount"
        });

        await user.save();

        res.status(201).json({
            message: "Stamp mounted into album successfully",
            album: user.album
        });
    } catch (error) {
        console.error("Error in mountStampToAlbum controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateAlbumNotes = async (req, res) => {
    try {
        const { stampId } = req.params;
        const { notes } = req.body;
        const user = req.user;

        user.album = user.album || [];
        const item = user.album.find(it => it.stamp.toString() === stampId.toString());

        if (!item) {
            // If it's not manually in album yet, mount it with this note
            user.album.push({
                stamp: stampId,
                acquiredDate: new Date(),
                notes: notes || "",
                source: "Collector Mount"
            });
        } else {
            item.notes = notes || "";
        }

        await user.save();

        res.status(200).json({
            message: "Album item notes updated",
            album: user.album
        });
    } catch (error) {
        console.error("Error in updateAlbumNotes controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const unmountFromAlbum = async (req, res) => {
    try {
        const { stampId } = req.params;
        const user = req.user;

        user.album = (user.album || []).filter(it => it.stamp.toString() !== stampId.toString());
        await user.save();

        res.status(200).json({
            message: "Stamp unmounted from album",
            album: user.album
        });
    } catch (error) {
        console.error("Error in unmountFromAlbum controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
