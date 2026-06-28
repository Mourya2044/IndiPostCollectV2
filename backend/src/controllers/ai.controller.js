import { recognizeStamps, chatWithAiService } from "../services/ai.service.js";
import ChatSession from "../models/aichatsession.model.js";
import crypto from "crypto";


export const recognizeStampsController = async (req, res) => {
    // 1. Guard Clause: Ensure a file was actually uploaded via Multer
    if (!req.file) {
        return res.status(400).json({
            message: "Upload failed",
            error: "No file was uploaded. Please attach an image."
        });
    }

    const image = req.file.buffer;
    const mimeType = req.file.mimetype;
    const { userNote } = req.body;

    try {
        // 2. AI Service call
        const result = await recognizeStamps(image, mimeType, userNote);

        // 3. Handle validation/business errors returned from the service gracefully
        if (!result.success) {
            return res.status(400).json({
                message: "Validation Error",
                error: result.error
            });
        }

        // 4. Return successful AI extraction response
        return res.status(200).json({
            data: result.data,
            message: "Stamps recognized successfully"
        });

    } catch (err) {
        // 5. Catch actual unexpected system/network crashes
        console.error("Controller Error:", err);
        return res.status(500).json({
            message: "Error processing stamp",
            error: err.message
        });
    }
};


export const chatWithAiController = async (req, res) => {
    const { message, sessionId } = req.body; // Expect sessionId from the frontend
    if (!message || !sessionId) {
        return res.status(400).json({ error: "Missing message or sessionId." });
    }

    try {
        const sessionExists = await ChatSession.findOne({ sessionId, userId: req.userId });
        if (!sessionExists) {
            return res.status(404).json({ error: "Chat session does not exist." });
        }

        // 1. Set explicit Server-Sent Events (SSE) network wrappers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        let completeResponse = "";
        const result = await chatWithAiService(message, sessionId, req.userId);

        if (!result.success) {
            return res.status(500).json({
                message: "Error processing chat",
                error: result.error
            });
        }

        for await (const chunk of result.stream) {
            if (chunk.content) {
                completeResponse += chunk.content;
                res.write(`data: ${JSON.stringify({ text: chunk.content })}\n\n`);
            }
        }

        await result.updateHistory(completeResponse);
    } catch (err) {
        console.error("Controller Error:", err);
        return res.status(500).json({
            message: "Error processing chat",
            error: err.message
        });
    } finally {
        res.end();
    }
};

export const newChatSessionController = async (req, res) => {
    try {
        const sessionId = crypto.randomUUID();
        const newSession = new ChatSession({
            userId: req.userId,
            sessionId: sessionId,
            title: "New Chat",
        });
        await newSession.save();

        return res.status(201).json({
            message: "Chat session created successfully",
            sessionId: sessionId,
            session: newSession,
        });
    } catch (err) {
        console.error("Error creating new chat session:", err);
        return res.status(500).json({
            message: "Error creating new chat session",
            error: err.message,
        });
    }
};

export const getChatSessionsController = async (req, res) => {
    try {
        const sessions = await ChatSession.find({ userId: req.userId }).sort({ updatedAt: -1 });
        return res.status(200).json(sessions);
    } catch (err) {
        console.error("Error fetching chat sessions:", err);
        return res.status(500).json({
            message: "Error fetching chat sessions",
            error: err.message
        });
    }
};

export const getChatSessionMessagesController = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await ChatSession.findOne({ sessionId, userId: req.userId });
        if (!session) {
            return res.status(404).json({ error: "Chat session not found." });
        }
        return res.status(200).json(session.messages || []);
    } catch (err) {
        console.error("Error fetching session messages:", err);
        return res.status(500).json({
            message: "Error fetching session messages",
            error: err.message
        });
    }
};

export const deleteChatSessionController = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await ChatSession.findOneAndDelete({ sessionId, userId: req.userId });
        if (!session) {
            return res.status(404).json({ error: "Chat session not found." });
        }
        return res.status(200).json({ message: "Chat session deleted successfully." });
    } catch (err) {
        console.error("Error deleting session:", err);
        return res.status(500).json({
            message: "Error deleting session",
            error: err.message
        });
    }
};

export const updateChatSessionTitleController = async (req, res) => {
    const { sessionId } = req.params;
    const { title } = req.body;
    if (!title || !title.trim()) {
        return res.status(400).json({ error: "Title is required." });
    }
    try {
        const session = await ChatSession.findOneAndUpdate(
            { sessionId, userId: req.userId },
            { title: title.trim() },
            { new: true }
        );
        if (!session) {
            return res.status(404).json({ error: "Chat session not found." });
        }
        return res.status(200).json(session);
    } catch (err) {
        console.error("Error updating session title:", err);
        return res.status(500).json({
            message: "Error updating session title",
            error: err.message
        });
    }
};