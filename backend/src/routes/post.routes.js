import express from 'express';
import { protect } from "../middlewares/auth.middleware.js";
import { createPost, getPosts, getPostbyId } from "../controllers/post.controller.js";


const postRouter = express.Router();

postRouter.post("/", protect, createPost);
postRouter.get("/", protect, getPosts);
postRouter.get("/:id", protect, getPostbyId);

export default postRouter;
