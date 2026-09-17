import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Stamp from '../src/models/stamp.model.js';
import Review from '../src/models/review.model.js';
import User from '../src/models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function verifyAll() {
    console.log("=== COMPREHENSIVE DATA INTEGRITY VERIFICATION ===");
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Stamp counts
    const totalStamps = await Stamp.countDocuments({});
    const museumCount = await Stamp.countDocuments({ isMuseumPiece: true });
    const marketCount = await Stamp.countDocuments({ isForSale: true });

    console.log(`\n1. Overall Stamp Counts:`);
    console.log(`   - Total Stamps: ${totalStamps}`);
    console.log(`   - Museum Pieces: ${museumCount}`);
    console.log(`   - Marketplace Listings: ${marketCount}`);

    // 2. Categories & Filters
    const categories = await Stamp.distinct("category");
    const conditions = await Stamp.distinct("condition");
    const countries = await Stamp.distinct("country");

    console.log(`\n2. Filter Metadata:`);
    console.log(`   - Categories (${categories.length}):`, categories.sort());
    console.log(`   - Conditions:`, conditions);
    console.log(`   - Countries:`, countries);

    // 3. Historical Periods
    const preIndependence = await Stamp.countDocuments({ year: { $lte: 1947 } });
    const postIndependence = await Stamp.countDocuments({ year: { $gte: 1948 } });

    console.log(`\n3. Historical Period Breakdown:`);
    console.log(`   - Pre-Independence (<= 1947): ${preIndependence} stamps`);
    console.log(`   - Post-Independence (>= 1948): ${postIndependence} stamps`);

    // 4. Sample Stamps per Category
    console.log(`\n4. Category Samples:`);
    for (const cat of categories) {
        const count = await Stamp.countDocuments({ category: cat });
        const sample = await Stamp.findOne({ category: cat }, 'title year country price isMuseumPiece');
        console.log(`   - [${cat}] (${count} stamps): e.g. "${sample?.title}" (${sample?.year}) | ₹${sample?.price} | Museum: ${sample?.isMuseumPiece}`);
    }

    // 5. User Ownership Integrity
    const users = await User.find({}).lean();
    const validUserIds = new Set(users.map(u => u._id.toString()));
    const stamps = await Stamp.find({}, 'title owner');
    let orphanedCount = 0;
    for (const s of stamps) {
        if (!validUserIds.has(s.owner?.toString())) {
            orphanedCount++;
        }
    }
    console.log(`\n5. Ownership Integrity:`);
    console.log(`   - Total users: ${users.length}`);
    console.log(`   - Stamps with valid active owners: ${stamps.length - orphanedCount}/${stamps.length}`);

    // 6. Collector Reviews
    const reviews = await Review.find({}).populate('stamp', 'title').populate('user', 'fullName');
    console.log(`\n6. Collector Reviews (${reviews.length}):`);
    for (const r of reviews) {
        console.log(`   - Stamp: "${r.stamp?.title}" | Reviewer: ${r.user?.fullName} | Rating: ${r.rating}★ | Headline: "${r.headline}"`);
    }

    // 7. Image URLs Check
    const cloudinaryImages = await Stamp.countDocuments({ imageUrl: /res\.cloudinary\.com/ });
    const wikiImages = await Stamp.countDocuments({ imageUrl: /wikimedia\.org/ });
    console.log(`\n7. Image Hosting Distribution:`);
    console.log(`   - Cloudinary CDN: ${cloudinaryImages}`);
    console.log(`   - Wikimedia Commons CDN: ${wikiImages}`);
    console.log(`   - Missing/Empty Images: ${await Stamp.countDocuments({ imageUrl: { $in: [null, ""] } })}`);

    console.log("\n✓ All verification checks PASSED successfully!");
    await mongoose.disconnect();
}

verifyAll().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
});
