import { ChatOpenRouter } from "@langchain/openrouter";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { z } from "zod";
import dotenv from 'dotenv';
dotenv.config();

// 1. Initialize the OpenRouter Model via LangChain
const model = new ChatOpenRouter({
    model: "openai/gpt-4o-mini",
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
});

// 2. Define the tool using Zod
const fetchStockPriceTool = tool(
    async ({ ticker }) => {
        try {
            console.log(`[DB/Tool] Executing native fetch query for: ${ticker}`);

            const mockDatabase = {
                'NVDA': { price: '124.50 USD', status: 'ACTIVE' },
                'GOOG': { price: '175.43 USD', status: 'ACTIVE' },
                'AAPL': { price: '210.20 USD', status: 'SUSPENDED' }
            };

            const result = mockDatabase[ticker.toUpperCase()];
            if (!result) return `Ticker ${ticker} not found in database.`;

            return JSON.stringify(result);
        } catch (error) {
            return "Failed to read database records.";
        }
    },
    {
        name: 'fetchStockPrice',
        description: 'Retrieves the real-time stock price for a given ticker symbol.',
        schema: z.object({
            ticker: z.string().describe("The stock ticker symbol, e.g., GOOG, NVDA")
        })
    }
);

// =========================================================================
// 3. EXECUTE THE UPDATED MODERN AGENT ENGINES
// =========================================================================
async function runAgent() {
    try {
        // Compile using the current first-party standard method
        const agentEngine = createAgent({
            model: model,
            tools: [fetchStockPriceTool],
            // Modern option parameter for establishing default framework settings
            systemPrompt: "You are a concise financial advisor agent."
        });

        console.log("Invoking modern agent loop engine...");
        const responseState = await agentEngine.invoke({
            messages: [{
                role: 'user',
                content: 'Check the stock price of AAPL. If its status is SUSPENDED, then fetch the price of NVDA instead.'
            }]
        });

        // Pull the final assistant reply chunk cleanly from history
        const finalMessageIndex = responseState.messages.length - 1;
        console.log("\nAI Final Answer:", responseState.messages[finalMessageIndex].content);

    } catch (error) {
        console.error("Modern LangChain Agent Error:", error);
    }
}

runAgent();