import { aiModel } from "../lib/ai.js";
import { HumanMessage } from "@langchain/core/messages";
import { ArchivedMongoHistory } from "../lib/ai.js";

import { success, z } from "zod";

function fileToDataUrl(imageBuffer, mimeType) {
    const base64Data = imageBuffer.toString("base64");
    return `data:${mimeType};base64,${base64Data}`;
}

export const recognizeStamps = async (imageBuffer, mimeType, userNote = "") => {
    try {
        // 1. Guard Clause: Check if the MIME type is a valid image
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (!mimeType || !allowedMimeTypes.includes(mimeType.toLowerCase())) {
            return {
                success: false,
                error: "Invalid file type. Please upload a valid image (JPEG, PNG, or WEBP)."
            };
        }

        // 2. Extra Safety: Ensure the buffer actually contains data
        if (!imageBuffer || imageBuffer.length === 0) {
            return {
                success: false,
                error: "The uploaded image file appears to be empty."
            };
        }

        const imageURL = fileToDataUrl(imageBuffer, mimeType);

        const stampSchema = z.object({
            isStamp: z.boolean().describe("True only if the image prominently features a postage stamp. False for random objects, people, animals, or unrelated photos."),

            title: z.string().optional().nullable().describe("The official name or common identifier of the stamp (e.g. 'Penny Black', 'Inverted Jenny', '150 Years of India Post')."),
            country: z.string().optional().nullable().describe("The country or region of issue (e.g. 'United Kingdom', 'India', 'United States')."),
            year: z.number().optional().nullable().describe("The year the stamp was released/issued. Use historical records if not printed on the stamp."),
            category: z.array(z.string()).optional().nullable().describe("A list of themes, categories, or keywords for this stamp (e.g. ['Historical', 'Rare', 'Commemorative', 'Royalty', 'Wildlife', 'Transportation'])."),
            condition: z.string().optional().nullable().describe("Determine or estimate the condition of the stamp as shown in the image (e.g. 'Mint', 'Used', 'Damaged')."),
            description: z.string().optional().nullable().describe(
                "A rich, educational description of the stamp. It must include: " +
                "1) What the stamp commemorates or represents, " +
                "2) Historical context and details about its design (e.g., engraving details, watermark, or coloring), " +
                "3) Rarity classification (explain if it is a common definitive stamp, a rarer commemorative issue, or an extremely rare historical collector's item), " +
                "4) Interesting facts, stories, or trivia (e.g., printing errors, historical significance, or the story of its release). " +
                "Make it highly engaging and educational so the user can thoroughly learn about this stamp's legacy."
            )
        });

        const structuredModel = aiModel.withStructuredOutput(stampSchema);

        const messageInput = new HumanMessage({
            content: [
                {
                    type: "text",
                    text: "Analyze this image. First, determine if it is actually a postage stamp. If it is NOT a stamp, set isStamp to false. " +
                        "If it IS a stamp, set isStamp to true and carefully analyze its details. " +
                        "Your goal is to provide a comprehensive educational profile of the stamp. " +
                        "Identify whether it is a rare historical classic (like the Penny Black or Inverted Jenny) or a modern stamp. " +
                        "Extract and construct detailed, interesting facts, historical background, year of issue, country, and thematic categories, " +
                        "and synthesize a rich, educational description that helps users learn about the stamp's heritage and significance."
                },
                {
                    type: "text",
                    text: "User's Note: " + userNote
                },
                {
                    type: "image_url",
                    image_url: { url: imageURL }
                }
            ]
        });

        // console.log("Processing Stamp with AI...");

        const structuredResponse = await structuredModel.invoke([messageInput]);

        if (!structuredResponse.isStamp) {
            return {
                success: false,
                error: "The uploaded image does not appear to be a valid postage stamp."
            };
        }

        // Return a consistent response format
        return {
            success: true,
            data: structuredResponse
        };
    } catch (error) {
        console.error("Error processing stamp:", error);

        // Catch specific AI API failure modes (like if a user uploads a fake image renamed to .jpg)
        if (error.message && error.message.includes("invalid image")) {
            return {
                success: false,
                error: "The file could not be read as an image. It may be corrupted."
            };
        }

        throw error;
    }
};

export const chatWithAiService = async (userMessage, sessionId, userId) => {
    try {
        const chatHistory = new ArchivedMongoHistory(
            sessionId,
            userId
        );

        await chatHistory.addUserMessage(userMessage);

        const conversationHistory = await chatHistory.getMessages();

        const stream = await aiModel.stream(conversationHistory);

        return {
            success: true,
            stream: stream,
            updateHistory: async (responseMessage) => {
                await chatHistory.addAIMessage(responseMessage);
            }
        }
    } catch (err) {
        console.error("Error processing chat:", err);
        return {
            success: false,
            error: err.message
        }
    }
}