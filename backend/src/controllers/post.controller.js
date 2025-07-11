import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

export const createPost = async (req, res) => {
  try {
    const { title, description, images } = req.body;
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
      userId,
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
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const rawposts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName profilePic')
      .skip((page - 1) * limit)
      .limit(limit);

    // Get comment count grouped by postId
    const commentCounts = await Comment.aggregate([
      { $match: { postId: { $in: rawposts.map(post => post._id) } } },
      { $group: { _id: "$postId", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    commentCounts.forEach(item => {
      countMap[item._id.toString()] = item.count;
    });

    const posts = rawposts.map(post => ({
      ...post.toObject(),
      comments: countMap[post._id.toString()] || 0,
    }));

    // Get total posts count for pagination
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    // If no posts found, respond with empty array inside object (not 404)
    if (posts.length === 0) {
      return res.status(200).json({
        posts: [],
        currentPage: page,
        totalPages,
      });
    }

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in getPosts controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getPostbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('userId', 'fullName profilePic');
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostbyId controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const rawposts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName profilePic')
      .skip((page - 1) * limit)
      .limit(limit);

    const commentCounts = await Comment.aggregate([
      { $match: { postId: { $in: rawposts.map(post => post._id) } } },
      { $group: { _id: "$postId", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    commentCounts.forEach(item => {
      countMap[item._id.toString()] = item.count;
    });

    const posts = rawposts.map(post => ({
      ...post.toObject(),
      comments: countMap[post._id.toString()] || 0,
    }));

    // Get total posts count for pagination
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    // If no posts found, respond with empty array inside object (not 404)
    if (posts.length === 0) {
      return res.status(200).json({
        posts: [],
        currentPage: page,
        totalPages,
      });
    }

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in getPostsByUserId controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getCommentsOfPostbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ postId: id }).populate('userId', 'fullName profilePic');
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error in getCommentsOfPostbyId controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete images from Cloudinary
    if (post.images && post.images.length > 0) {
      await Promise.all(post.images.map(async (imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`posts/${publicId}`);
      }));
    }

    await Comment.deleteMany({ postId: id });

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(like => like.toString() !== userId.toString());
      await post.save();
      return res.status(200).json({ message: "Post unliked successfully", post });
    }

    // Add the user's ID to the likes array
    post.likes.push(userId);
    await post.save();

    res.status(200).json({ message: "Post liked successfully", post });
  } catch (error) {
    console.error("Error in likePost controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // const userDetails = await getUserDetails(userId);
    const newComment = new Comment({
      postId: id,
      userId,
      text
    });
    await newComment.save();
    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error in commentOnPost controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
