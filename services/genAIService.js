import { GoogleGenerativeAI } from "@google/generative-ai";
import { functions } from "../Laborers/functions.js";
import { declarations } from "../Laborers/declarations.js";

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);

const generativeModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: {
        functionDeclarations: declarations,
    },
});

export async function processPrompt(prompt) {
    const chat = generativeModel.startChat();
    let result = await chat.sendMessage(prompt);

    while (true) {
        const call = result.response.functionCalls()?.[0]; // Get the first function call

        if (!call) break; // If no function call, stop recursion

        console.log(`🔄 Function Call Detected: ${call.name}`, call.args);

        // Check if the function exists in our mapping
        if (functions[call.name]) {
            try {
                const apiResponse = await functions[call.name](call.args); // Execute function

                console.log(`✅ Function Executed: ${call.name}`, apiResponse);

                // Send response back to Gemini
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