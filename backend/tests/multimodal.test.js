import { ChatOpenRouter } from "@langchain/openrouter";
import { HumanMessage } from "@langchain/core/messages";
import * as fs from 'fs';
import { z } from "zod";
import dotenv from 'dotenv';
dotenv.config();

// 1. Initialize OpenRouter via the dedicated LangChain module
const model = new ChatOpenRouter({
    model: "openai/gpt-4o-mini", // Maps natively over the network
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
});

// 2. Convert local image file to base64 Data URL
function fileToDataUrl(path, mimeType) {
    const base64Data = fs.readFileSync(path).toString("base64");
    return `data:${mimeType};base64,${base64Data}`;
}

async function analyzeImage() {
    try {
        const imageUrl = fileToDataUrl('./tests/invoice.png', 'image/png');

        // 3. Define the structural validation target schema using Zod
        const InvoiceSchema = z.object({
            items: z.array(z.object({
                name: z.string().describe("The name of the item."),
                quantity: z.number().describe("The quantity of the item."),
                price: z.number().describe("The price of the item."),
                total: z.number().describe("The total price of the item.")
            })),
            totalAmountDue: z.string().describe("The total outstanding amount due on the invoice."),
            invoiceNumber: z.string().describe("The unique alphanumeric identifier of the invoice document."),
            vendorName: z.string().describe("The company or vendor name that issued the document."),
            description: z.string().describe("A brief description of the invoice.")
        });

        // 4. Attach the schema constraints directly to the driver engine instance
        const structuredModel = model.withStructuredOutput(InvoiceSchema);

        // 5. Construct a standard LangChain Multimodal Message object array
        const messageInput = new HumanMessage({
            content: [
                {
                    type: "text",
                    text: "Extract the items, their prices and quantities, and total price. Also extract exact total amount due, invoice number, and vendor name fields and a brief description of the invoice from this document image."
                },
                {
                    type: "image_url",
                    image_url: { url: imageUrl }
                }
            ]
        });

        console.log("Processing image file via LangChain OpenRouter pipeline...");

        // 6. Invoke the structured model pipeline
        const structuredResponse = await structuredModel.invoke([messageInput]);

        // Output is instantly a native pre-validated JavaScript Object!
        console.log("\nSuccessfully Extracted Object Structure:");
        console.log(structuredResponse);

        // You can read the parameters safely directly:
        // console.log(`Vendor: ${structuredResponse.vendorName}`);

    } catch (error) {
        console.error("LangChain OpenRouter Vision Error:", error);
    }
}

analyzeImage();