import { ChatOpenRouter } from "@langchain/openrouter";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// Initialized exactly ONCE when the server boots up
export const aiModel = new ChatOpenRouter({
    model: "openai/gpt-4o-mini",
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    temperature: 0.7,
});

export class ArchivedMongoHistory {
    constructor(sessionId, userId = null, maxMessages = 24, archiveCount = 10) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.maxMessages = maxMessages;
        this.archiveCount = archiveCount;

        // Retrieve collection references directly from Mongoose's active connection
        this.collection = mongoose.connection.db.collection("chatsessions");
        this.archiveCollection = mongoose.connection.db.collection("archivedmessages");

        this.langchainHistory = new MongoDBChatMessageHistory({
            collection: this.collection,
            sessionId: this.sessionId,
            sessionIdKey: "sessionId",
            historyKey: "messages",
        });
    }

    async getMessages() {
        return await this.langchainHistory.getMessages();
    }

    async addUserMessage(text) {
        await this.addMessage(new HumanMessage(text));
    }

    async addAIMessage(text) {
        await this.addMessage(new AIMessage(text));
    }

    async addMessage(message) {
        // 1. Let LangChain append the new message to the "History" array
        await this.langchainHistory.addMessage(message);

        // 2. Fetch the current state of the document to check its length
        const doc = await this.collection.findOne({ sessionId: this.sessionId });

        if (doc && doc.messages && doc.messages.length > this.maxMessages) {
            // Extract the oldest messages that are about to be sliced out
            const messagesToArchive = doc.messages.slice(0, this.archiveCount);

            // 3. Move the overflowed messages to the archive collection
            const archivedCount = await this.archiveCollection.countDocuments({ sessionId: this.sessionId });

            await this.archiveCollection.insertMany(
                messagesToArchive.map((msg, index) => ({
                    userId: this.userId,
                    sessionId: this.sessionId,
                    type: msg.type,
                    data: msg.data,
                    archived_at: new Date(),
                    sequence: archivedCount + index
                }))
            );

            // 4. Safely trim the primary active cache document using $slice
            const keepCount = doc.messages.length - this.archiveCount;
            await this.collection.updateOne(
                { sessionId: this.sessionId },
                {
                    $push: {
                        messages: {
                            $each: [],
                            $slice: -keepCount
                        }
                    }
                }
            );
        }
    }

    // Helper method if you ever want to fetch the deep archives for infinite scrolling
    async getArchivedMessages(limit = 50, skip = 0) {
        return await this.archiveCollection
            .find({ SessionId: this.sessionId })
            .sort({ archived_at: -1 }) // Newest archived records first
            .skip(skip)
            .limit(limit)
            .toArray();
    }
}