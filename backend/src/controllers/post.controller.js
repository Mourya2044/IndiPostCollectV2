import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

export const createPost = async (req, res) => {
    try {
        const {title, description, images } = req.body;
        const name = req.user.fullName;
        const avatar = req.user.profilePic;
        const userId = req.user._id;

        const imagesUrls = images && images.length > 0 ? await Promise.all(images.map(async (image) => {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "posts",
                allowed_formats: ["jpg", "png", "webp"],
                transformation: [
                    { width: 800, height: 600, crop: "limit" }
                ]
            });
            return uploadResponse.secure_url;
        })) : [];

        const newPost = new Post({
            user: { name, avatar, userId },
            title,
            description,
            images: imagesUrls,
        });

        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error in createPost controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPosts = async (req, res) => {
  try {
    const rawposts = await Post.find().sort({ createdAt: -1 });

    // Get comment count grouped by postId
    const commentCounts = await Comment.aggregate([
      { $match: { postId: { $in: rawposts.map(post => post._id) } } },
      { $group: { _id: "$postId", count: { $sum: 1 } } }
    ]);

    // Convert to a map for quick access
    const countMap = {};
    commentCounts.forEach(item => {
      countMap[item._id.toString()] = item.count;
    });

    // Attach commentCount to each post
    const posts= rawposts.map(post => ({
      ...post.toObject(),
      comments: countMap[post._id.toString()] || 0
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPosts controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostbyId = async (req, res) => {
    try {
        const {id} = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in getPostbyId controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
