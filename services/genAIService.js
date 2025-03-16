import { GoogleGenerativeAI } from "@google/generative-ai";
import { controlLightFunctionDeclaration } from "../functions/controlLight.js";
import { functions } from "../functions/controlLight.js";

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);

const generativeModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: {
        functionDeclarations: [controlLightFunctionDeclaration],
    },
});

export async function processPrompt(prompt) {
    const chat = generativeModel.startChat();
    const result = await chat.sendMessage(prompt);

    const call = result.response.functionCalls()[0];

    if (call) {
        const apiResponse = await functions[call.name](call.args);

        const result2 = await chat.sendMessage([{
            functionResponse: {
                name: call.name,
                response: apiResponse
            }
        }]);

        return result2.response.text();
    }

    return "No function call detected.";
}