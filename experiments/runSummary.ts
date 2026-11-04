//import { parisCorrection01 } from "../data/paris-correction-01";
import { romeLongCorrection01 } from "../data/rome-long-correction-01";
import { updateSummary } from "../src/memory/summaryMemory";
import { extractRequirements } from "../src/llm/extractRequirements";
import { evaluateRequirements } from "./evaluate";

//const testCase = parisCorrection01;
const testCase = romeLongCorrection01;

async function runSummaryExperiment() {
    let summary = "";
    //consider a pair of conversation as a batch
    for (let i = 0; i < testCase.dialogue.length; i += 2) {
        const batch = testCase.dialogue.slice(i, i + 2);
        summary = await updateSummary(summary, batch);
    }

    console.log("Final Summary:");
    console.log(summary);
    const predicted = await extractRequirements([
        {
            role: "user",
            content: summary
        }
    ]);
    
    console.log("\nExtracted Requirements:");
    console.log(predicted);
    
    const result = evaluateRequirements(
        testCase.expectedRequirements,
        predicted
    );
    
    console.log("\nSummary Memory Evaluation:");
    console.log(`Correct: ${result.correct}/${result.total}`);
    console.log(`Overall Accuracy: ${result.accuracy.toFixed(2)}%`);
}

runSummaryExperiment().catch(console.error);
