import { GoogleGenerativeAI } from "@google/generative-ai";
import BrowserAdapter from "../browser/browserAdapter.js";
import { browserAdapterFunctionDeclarations } from "../browser/adapterDeclarations.js";

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);
const generativeModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: {
        functionDeclarations: browserAdapterFunctionDeclarations,
    },
});

export async function processPrompt(prompt) {
    const systemPrompt = {
        parts: [{
            text: `
                If user ask for navigate somewhere dont ask him for full url find your self.
                You are an automated web browser that can follow user instructions.
                You will use the provided functions to interact with websites.
                Prioritize using the least amount of function calls as possible.
                If a selector is needed, and the selector is not provided, use the evaluate function to get the selector.
                If you are unsure of the selector, use the evaluate function to find it.
                Use the getText function to verify information on the page.
                If you are asked to enter text into a field, use the type function.
                If you are asked to click a button, use the click function.
                If you are asked to navigate to a page, use the navigate function.
                If the user provides a website name or a partial URL, use your knowledge to determine the full URL.
                If you cannot determine the full URL, inform the user that you need a full URL.
                If the user asks to navigate to a specific page on a website (e.g., 'subscriptions page on YouTube'), use the navigate function with the appropriate URL for that sub-page.
                If you are unsure of the correct URL for a sub-page, inform the user and ask for clarification.
                When asked to navigate to a sub page, if the url is not provided, use the evaluate function to find the link to the sub page.
                If a task is completed, or can not be completed, inform the user.
            `,
        }],
    };

    const chat = generativeModel.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 2048,
        },
        systemInstruction: systemPrompt,
    });

    let result = await chat.sendMessage(prompt);

    while (true) {
        const call = result.response.functionCalls()?.[0]; // Get the first function call

        if (!call) break; // If no function call, stop recursion

        console.log(`🔄 Function Call Detected: ${call.name}`, call.args);

        // Check if the function exists in our mapping
        if (BrowserAdapter[call.name]) {
            try {
                const apiResponse = await BrowserAdapter[call.name](call.args); // Execute function

                console.log(`✅ Function Executed: ${call.name}`, apiResponse);

                // Send response back to Gemini
                result = await chat.sendMessage([{
                    functionResponse: {
                        name: call.name,
                        response: { // Wrap the array in an object
                            results: apiResponse // apiResponse is your array of objects
                        }
                    }
                }]);
            } catch (error) {
                console.error(`❌ Error executing function: ${call.name}`, error);
                break;
            }
        } else {
            console.warn(`⚠️ No matching function found for: ${call.name}`);
            break;
        }
    }

    return result.response.text();
}