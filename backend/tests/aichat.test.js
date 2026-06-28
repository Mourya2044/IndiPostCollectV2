import { ChatOpenRouter } from "@langchain/openrouter";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import dotenv from 'dotenv';
dotenv.config();


const model = new ChatOpenRouter({
    model: "openai/gpt-4o-mini",
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
});

// 1. Initialize LangChain's decoupled, streamlined message history storage module
const memoryStore = new InMemoryChatMessageHistory();


async function chatTurn(userMessageText) {
    // 2. Log the new human prompt into your persistent storage instance
    await memoryStore.addUserMessage(userMessageText);

    // 3. Pull the entire compiled array history out of storage
    const fullConversationHistory = await memoryStore.getMessages();

    // 4. Stream tokens directly passing the standard array block
    const stream = await model.stream(fullConversationHistory);

    let completeResponseText = "";
    process.stdout.write("AI: ");

    for await (const chunk of stream) {
        if (typeof chunk.content === "string") {
            process.stdout.write(chunk.content);
            completeResponseText += chunk.content; // Stitch chunks together
        }
    }
    console.log("\n-----------------------------------\n");

    // 5. Commit the finalized AI answer back into the storage layer
    await memoryStore.addAIMessage(completeResponseText);
}

async function runSession() {
    console.log("User: Say 'Hello' in French.");
    await chatTurn("Say 'Hello' in French.");

    console.log("User: Say 'Goodbye' in French.");
    await chatTurn("Say 'Goodbye' in French.");
}

runSession();


/***
 * 
 * create new chat
 * it creates a chat id
 * chats are stored as separate messages with question and response in order
 * 
 * 
 * can resume old chats
 * 
 * we can get the previous messages using chat id
 * and append them in the history
 * 
 * 
 * 
 * 
*/