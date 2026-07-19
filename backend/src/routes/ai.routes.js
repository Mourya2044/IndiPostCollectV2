// POST /api/ai/recognize (protected route)
// POST /api/ai/chat (public/protected chat completion)

import express from "express";
import multer from 'multer';
import { protect } from "../middlewares/auth.middleware.js";
import { 
    recognizeStampsController, 
    chatWithAiController, 
    newChatSessionController,
    getChatSessionsController,
    getChatSessionMessagesController,
    deleteChatSessionController,
    updateChatSessionTitleController,
    getAiUsageController
} from "../controllers/ai.controller.js";

const aiRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Mount the new routes under /api/ai/...
aiRouter.get("/usage", protect, getAiUsageController);
aiRouter.post("/recognize", protect, upload.single("image"), recognizeStampsController);
aiRouter.post("/chat", protect, chatWithAiController);
aiRouter.post("/new-chat", protect, newChatSessionController);
aiRouter.get("/sessions", protect, getChatSessionsController);
aiRouter.get("/sessions/:sessionId/messages", protect, getChatSessionMessagesController);
aiRouter.delete("/sessions/:sessionId", protect, deleteChatSessionController);
aiRouter.patch("/sessions/:sessionId/title", protect, updateChatSessionTitleController);

export default aiRouter;
