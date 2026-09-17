import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../lib/cloudinary.js';
import Stamp from '../models/stamp.model.js';
import User from '../models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CATEGORY_MAP = {
    'airmail': 'Aviation',
    'thematic_collection': 'Flora & Fauna',
    'indian': 'Historical',
    'historic': 'Historical',
    'commemoration': 'Commemorative',
    'transportation': 'Historical',
    'mail': 'Definitive',
    'tech': 'Aviation',
    'rare': 'Historical',
    'historical': 'Historical',
    'definitive': 'Definitive'
};

async function normalizeAndUpload() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const users = await User.find({}).lean();
    const adminUser = users.find(u => u.type === 'admin') || users[0];

    // 1. Fix old test stamps
    const stamps = await Stamp.find({});
    console.log(`Checking ${stamps.length} stamps for normalization...`);

    for (const stamp of stamps) {
        let changed = false;

        // Ensure owner is a valid existing user
        if (!users.some(u => u._id.toString() === stamp.owner?.toString())) {
            stamp.owner = adminUser._id;
            changed = true;
        }

        // Normalize categories to proper Title Case
        const newCats = stamp.category.map(cat => {
            const mapped = CATEGORY_MAP[cat.toLowerCase()];
            return mapped || cat;
        });

        // Deduplicate
        const uniqueCats = Array.from(new Set(newCats));
        if (JSON.stringify(uniqueCats) !== JSON.stringify(stamp.category)) {
            stamp.category = uniqueCats;
            changed = true;
        }

        // Fix known inaccuracies in early test stamps
        if (stamp.title.includes("Mauritius Post Office")) {
            stamp.country = "Mauritius";
            stamp.year = 1847;
            stamp.description = "Issued in 1847 in the British crown colony of Mauritius, the 'Post Office' stamps are among the most famous and valuable philatelic rarities in the world.";
            changed = true;
        } else if (stamp.title.includes("Penny Black")) {
            stamp.country = "United Kingdom";
            stamp.year = 1840;
            stamp.description = "The Penny Black was the world's first adhesive postage stamp used in a public postal system, issued in the United Kingdom on 1 May 1840.";
            changed = true;
        } else if (stamp.title.includes("Treskilling Yellow")) {
            stamp.country = "Sweden";
            stamp.year = 1855;
            stamp.description = "The Treskilling Yellow is a Swedish postage stamp from 1855, famous as a unique colour error printed in yellow-orange instead of blue-green.";
            changed = true;
        }

        if (changed) {
            await stamp.save();
            console.log(`Normalized stamp: "${stamp.title}"`);
        }
    }

    // 2. Upload any non-Cloudinary images to Cloudinary with polite 2s delay
    const nonCloudinaryStamps = await Stamp.find({ imageUrl: { $not: /res\.cloudinary\.com/ } });
    console.log(`\nFound ${nonCloudinaryStamps.length} stamps with external images to upload to Cloudinary...`);

    for (let i = 0; i < nonCloudinaryStamps.length; i++) {
        const s = nonCloudinaryStamps[i];
        console.log(`[${i + 1}/${nonCloudinaryStamps.length}] Uploading image for "${s.title}"...`);

        try {
            // Clean url
            const cleanUrl = s.imageUrl.split('?')[0];
            const fetchRes = await fetch(cleanUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            if (fetchRes.ok) {
                const arrayBuffer = await fetchRes.arrayBuffer();
                const base64Data = 'data:image/jpeg;base64,' + Buffer.from(arrayBuffer).toString('base64');
                const uploadRes = await cloudinary.uploader.upload(base64Data, {
                    folder: "stamps",
                    allowed_formats: ["jpg", "png", "webp", "jpeg"],
                    transformation: [{ width: 600, height: 600, crop: "limit" }]
                });
                s.imageUrl = uploadRes.secure_url;
                await s.save();
                console.log(`  ✓ Cloudinary uploaded: ${uploadRes.secure_url}`);
            } else {
                console.warn(`  Fetch returned ${fetchRes.status} for ${s.title}`);
            }
        } catch (err) {
            console.warn(`  Failed for ${s.title}: ${err.message}`);
        }

        // Polite delay to avoid Wikimedia rate limit
        await new Promise(r => setTimeout(r, 2000));
    }

    const finalDistinct = await Stamp.distinct("category");
    const finalCloudinaryCount = await Stamp.countDocuments({ imageUrl: /res\.cloudinary\.com/ });
    const totalCount = await Stamp.countDocuments({});

    console.log("\nNormalization and migration complete!");
    console.log(`Total stamps: ${totalCount}`);
    console.log(`Cloudinary hosted: ${finalCloudinaryCount}/${totalCount}`);
    console.log("Distinct categories:", finalDistinct);

    await mongoose.disconnect();
}

normalizeAndUpload().catch(console.error);
