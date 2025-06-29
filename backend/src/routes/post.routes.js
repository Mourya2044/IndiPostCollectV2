import express from 'express';
import { protect } from "../middlewares/auth.middleware.js";
import { createPost, getPosts, getPostbyId, deletePost, likePost, getCommentsOfPostbyId, commentOnPost } from "../controllers/post.controller.js";


const postRouter = express.Router();

postRouter.post("/", protect, createPost);
postRouter.get("/", protect, getPosts);
postRouter.get("/:id", protect, getPostbyId);
postRouter.get("/:id/comments", protect, getCommentsOfPostbyId);
postRouter.delete("/:id", protect, deletePost);

postRouter.put("/like/:id", protect, likePost);
postRouter.put("/comment/:id", protect, commentOnPost);

export default postRouter;
