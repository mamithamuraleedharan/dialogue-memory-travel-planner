import { parisCorrection01 } from "../data/paris-correction-01";
import { addTurn } from "../src/memory/fullHistory";
import type { DialogueTurn } from "../src/dialogue/types";
import { extractRequirements } from "../src/llm/extractRequirements";
import { evaluateRequirements } from "./evaluate";

let history: DialogueTurn[] = [];

// calling addTurn function to build the conversation historry
for (const turn of parisCorrection01.dialogue) {
    history = addTurn(history, turn);
}

console.log("Total dialogue turns:", history.length); // 19 for dataset 1

// storing everything of history to messages where speaker -> role , message -> content
const messages = history.map((turn) => ({
    role: turn.speaker,
    content: turn.message
}));

// get current requirements and calculate memory accuracy.
async function runFullHistoryExperiment() {
    const predicted = await extractRequirements(messages);

    console.log("\nExtracted Requirements by the LLM:");
    console.log(predicted);

    const result = evaluateRequirements(parisCorrection01.expectedRequirements,predicted); // ground truth and predicted

    console.log("\nFull History Evaluation:");
    console.log(`Correct: ${result.correct}/${result.total}`);
    console.log(`Overall Accuracy: ${result.accuracy.toFixed(2)}%`);
}

runFullHistoryExperiment().catch(console.error);