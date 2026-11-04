import type {Proposition,Question,ShortAnswer} from "./sisuTypes";

// Resolve
export function resolves(
    answer: ShortAnswer | Proposition,
    question: Question
): boolean {
    if (
        typeof answer === "object" &&
        question.predicate === answer.predicate
    ) {
        return true;
    }

    return false;
}
// Relevant 
export function relevant(
    answer: ShortAnswer | Proposition,
    question: Question
): boolean {
    
    if (typeof answer === "object") {
        return answer.predicate === question.predicate;
    }
    if (typeof answer === "string") {
        if (
            question.predicate === "budget" ||
            question.predicate === "travelers" ||
            question.predicate === "durationDays"
        ) {
            const value = Number(answer.replace(/[€,\s]/g, ""));

            return answer.trim() !== "" && Number.isFinite(value);
        }
    }
    return false;
}

// Combine - creates proposition budget = 600
export function combine(
    question: Question,
    answer: ShortAnswer | Proposition
): Proposition {
    if (!relevant(answer, question)) {
        throw new Error("Combine failed: answer is not relevant.");
    }
    if (typeof answer === "string") {
        return {
            predicate: question.predicate,
            argument: answer
        };
    }

    return answer;
}
