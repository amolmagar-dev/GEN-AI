import { processPrompt } from "./services/genAIService.js";

async function main() {
    const prompt = "Perform a Google search and retrieve search results.";
    const response = await processPrompt(prompt);
    console.log(response);
}

main();