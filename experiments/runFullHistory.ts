import { parisCorrection01 } from "../data/paris-correction-01";
import { addTurn } from "../src/memory/fullHistory";
import type { DialogueTurn } from "../src/dialogue/types";
import { ollamaClient } from "../src/llm/ollamaClient";

let history: DialogueTurn[] = [];
for (const turn of parisCorrection01.dialogue) {
    history = addTurn(history, turn);
}
console.log("Total dialogue turns:", history.length);
const messages = history.map((turn) => ({
    role: turn.speaker,
    content: turn.message
}));

async function generateItinerary() {
    const response = await ollamaClient.chat.completions.create({
        model: "llama3.1",
        messages: [
            {
                role: "system",
                content: "You are a travel planning assistant. Generate a travel itinerary based on the user's conversation. Use the latest information when the user corrects an earlier requirement. Do not invent missing travel requirements."
            },
            ...messages
        ]
    });

    console.log(response.choices[0].message.content);
}

generateItinerary().catch(console.error);
