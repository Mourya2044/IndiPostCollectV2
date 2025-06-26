import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        avatar: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
