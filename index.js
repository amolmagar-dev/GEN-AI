import { processPrompt } from "./services/genAIService.js";

async function main() {
    const prompt = "Dim the lights so the room feels cozy and warm.";
    const response = await processPrompt(prompt);
    console.log(response);
}

main();