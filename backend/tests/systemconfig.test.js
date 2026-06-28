import { ChatOpenRouter } from "@langchain/openrouter";
import dotenv from 'dotenv';
dotenv.config();

// 1. Initialize the OpenRouter Model passing your custom hyperparameters
const model = new ChatOpenRouter({
    model: "openai/gpt-4o-mini", // Maps to your target model category 
    openRouterApiKey: process.env.OPENROUTER_API_KEY,

    // Core parameters mapping
    temperature: 0.7,      // Controls randomness/creativity limits
    maxTokens: 150,        // Replaces Google's maxOutputTokens configuration

    // Advanced OpenRouter provider tracking overrides
    openrouterProvider: {
        data_collection: "deny", // Enforces absolute strict privacy constraints if needed
    }
});

async function generateHistoricalHeadline() {
    try {
        // 2. Set up the structural multi-role message prompt payload
        const messages = [
            {
                role: "system",
                content: "You are a 1920s newspaper reporter. Speak in period-accurate slang."
            },
            {
                role: "user",
                content: "Write a headline about deep sea exploration."
            }
        ];

        console.log("Invoking generation pipeline...");
        const response = await model.invoke(messages);

        console.log("\nGenerated Headline:");
        console.log(response.content);

    } catch (error) {
        console.error("LangChain Generation Error:", error);
    }
}

generateHistoricalHeadline();