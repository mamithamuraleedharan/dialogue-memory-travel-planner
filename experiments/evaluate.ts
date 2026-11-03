import type { TravelRequirements } from "../src/dialogue/types";



export function compareValues(
    expected: string | number | string[] | undefined,
    predicted: string | number | string[] | undefined
): boolean {

    if (typeof expected === "number" && typeof predicted === "number") {
        return expected === predicted;
    }
    if (typeof expected === "string" && typeof predicted === "string") {
        return expected.trim().toLowerCase() === predicted.trim().toLowerCase();
    }
    if (Array.isArray(expected) && Array.isArray(predicted)) {
        const normalize = (values: string[]) =>
            [...new Set(values.map(value => value.trim().toLowerCase()))].sort();

        const expectedArray = normalize(expected);
        const predictedArray = normalize(predicted);

        return expectedArray.length === predictedArray.length &&
            expectedArray.every((value, index) => value === predictedArray[index]);
    }

    return false;
}

// function that calculates accuracy
export function evaluateRequirements(
    expected: TravelRequirements,
    predicted: TravelRequirements
) {
    const fields = Object.keys(expected) as (keyof TravelRequirements)[];
    let correct = 0;
    let total = 0;

for (const field of fields) {
    if (expected[field] === undefined) {
        continue;
    }
    total++;
    if (compareValues(expected[field], predicted[field])) {
        correct++;
    }
}
const accuracy = total === 0 ? 0 : (correct / total) * 100;

return {correct,total,accuracy};
}