import { parisCorrection01 } from "../data/paris-correction-01";
import { romeLongCorrection01 } from "../data/rome-long-correction-01";
import { spainSemiSynthetic01 } from "../data/spain-semisynthetic-01";
import { addTurn } from "../src/memory/fullHistory";
import type { DialogueTurn } from "../src/dialogue/types";
import { extractRequirements } from "../src/llm/extractRequirements";
import { evaluateRequirements } from "./evaluate";


const datasets = {
    paris: parisCorrection01,
    rome: romeLongCorrection01,
    spain: spainSemiSynthetic01
};

const datasetName = process.env.DATASET ?? "paris";

if (!(datasetName in datasets)) {
    throw new Error(`Unknown dataset: ${datasetName}`);
}

const testCase = datasets[datasetName as keyof typeof datasets];


let history: DialogueTurn[] = [];

// calling addTurn function to build the conversation historry
for (const turn of testCase.dialogue) {
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

    const result = evaluateRequirements(testCase.expectedRequirements,predicted); // ground truth and predicted

    console.log("\nFull History Evaluation:");
    console.log(`Correct: ${result.correct}/${result.total}`);
    console.log(`Overall Accuracy: ${result.accuracy.toFixed(2)}%`);
}

runFullHistoryExperiment().catch(console.error);