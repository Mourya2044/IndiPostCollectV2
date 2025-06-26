import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        avatar: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

postSchema.index({ title: 'text', description: 'text', 'user.name': 'text' });

const Post = mongoose.model('Post', postSchema);
export default Post;