// {
//   _id,
//   title,
//   country,
//   year,
//   category: String[],      // e.g., Wildlife, Historical
//   description,
//   imageUrl,
//   isForSale: Boolean,
//   price: Number,
//   owner: ObjectId,       // references User
//   isMuseumPiece: Boolean,
//   createdAt,
//   updatedAt
// }

import mongoose from 'mongoose';

const stampSchema = new mongoose.Schema({
    title: { type: String, required: true },
    country: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: [String], required: true },
    condition: { type: String, enum: ['Mint', 'Used', 'Damaged'], default: 'Mint' },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isForSale: { type: Boolean, default: false },
    price: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isMuseumPiece: { type: Boolean, default: false },
    availableQuantity: { type: Number, default: 1 },
}, { timestamps: true });

stampSchema.index({ title: 'text', description: 'text', country: 'text' });

const Stamp = mongoose.model('Stamp', stampSchema);
export default Stamp;
