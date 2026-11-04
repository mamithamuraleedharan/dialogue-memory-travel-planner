import { parisCorrection01 } from "../data/paris-correction-01";
import { romeLongCorrection01 } from "../data/rome-long-correction-01";
import { spainSemiSynthetic01 } from "../data/spain-semisynthetic-01";
import { initialTravelIS } from "../src/dialogue/sisuIs";
import { processTravelUtterance } from "../src/dialogue/sisuManager";
import { sisuToRequirements } from "../src/dialogue/sisuToRequirements";
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
async function runSisuExperiment() {
    let state = initialTravelIS();

    for (let i = 0; i < testCase.dialogue.length; i++) {
        const turn = testCase.dialogue[i];

       // retrieves 4 previous turns
        const recentTurns = testCase.dialogue.slice(
            Math.max(0, i - 4),
            i
        );

        const recentContext = recentTurns
            .map((previous) =>
                `${previous.speaker}: ${previous.message}`
            )
            .join("\n");

        state = await processTravelUtterance(
            state,
            turn.message,
            turn.speaker,
            recentContext
        );
    }

    console.log("Final SISU Information State:");
    console.log(state.shared.com);

    const predicted = sisuToRequirements(state);

    console.log("\nExtracted SISU Requirements:");
    console.log(predicted);

    const result = evaluateRequirements(
        testCase.expectedRequirements,
        predicted
    );

    console.log("\nSISU Evaluation:");
    console.log(`Correct: ${result.correct}/${result.total}`);
    console.log(`Overall Accuracy: ${result.accuracy.toFixed(2)}%`);
}

runSisuExperiment().catch(console.error);
