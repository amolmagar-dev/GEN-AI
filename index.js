import readline from "readline";
import { processPrompt } from "./services/genAIService.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    while (true) {
        const prompt = await new Promise((resolve) => {
            rl.question("\nEnter your prompt (or type 'exit' to quit): ", resolve);
        });

        if (!prompt.trim()) {
            console.log("⚠️ Prompt cannot be empty. Please try again.");
            continue; // Repeats the loop
        }

        if (prompt.toLowerCase() === "exit") {
            console.log("👋 Exiting chat...");
            rl.close();
            break;
        }

        try {
            const response = await processPrompt(prompt);
            console.log("🧠 Response:", response);
        } catch (error) {
            console.error("❌ Error processing prompt:", error);
        }
    }
}

main();