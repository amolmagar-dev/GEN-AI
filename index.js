import { processPrompt } from "./services/genAIService.js";

async function main() {
    const prompt = "what is smartshiphub?";
    const response = await processPrompt(prompt);
    console.log(response);
}

main();