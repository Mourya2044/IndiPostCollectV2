import mongoose from "mongoose";

const archivedMessages = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: Object, required: true },
    sequence: { type: Number, required: true },
    archived_at: { type: Date, default: Date.now }
}, { timestamps: true });

const ArchivedMessages = mongoose.model('ArchivedMessages', archivedMessages);

export default ArchivedMessages;