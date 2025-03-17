import readline from "readline";
import { processPrompt } from "./services/genAIService.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    rl.question("Enter your prompt: ", async (prompt) => {
        if (!prompt.trim()) {
            console.log("Prompt cannot be empty. Please try again.");
            rl.close();
            return;
        }

        try {
            const response = await processPrompt(prompt);
            console.log("Response:", response);
        } catch (error) {
            console.error("Error processing prompt:", error);
        }

        rl.close();
    });
}

main();