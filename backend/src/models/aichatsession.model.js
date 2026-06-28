import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },

    title: { type: String, default: "" },
    summary: { type: String, default: "" },

    messages: { type: [Object], default: [] }
}, { timestamps: true });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;