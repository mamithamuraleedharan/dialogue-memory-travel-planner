
import { ollamaClient } from "../llm/ollamaClient";
import type { TravelMove } from "./sisuTypes";

const validPredicates = [
    "destination",
    "startDate",
    "durationDays",
    "budget",
    "interests",
    "transport",
    "travelers"
];

export async function interpretTravelUtterance(
    utterance: string, //dialogue
    currentFacts: string, // budget = 200
    currentQuestion?: string, //in qud
    speaker: "user" | "assistant" = "user",
    recentContext: string = "" // 4 turns
): Promise<TravelMove[]> {
    const response = await ollamaClient.chat.completions.create({
        model: "llama3.1",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content: `You are the NLU component of a travel-planning dialogue system.
                            Interpret the utterance as dialogue moves.
                            Speaker: ${speaker}
                            Supported predicates:
                            destination, startDate, durationDays, budget, interests, transport, travelers.
                            Supported move types:
                            - ask: A question requesting a travel requirement.
                            - answer: A short answer to the current question.
                            - provide: A new travel requirement.
                            - add: Add an additional interest.
                            - correct: Explicitly revise an earlier requirement.
                            Rules:
                            - Use the current question to interpret short answers.
                            - Do not treat ordinary questions as new travel requirements.
                            - Do not invent information or infer changes that were not stated.
                            - Only use "correct" when the user explicitly changes an existing requirement.
                            - Do not interpret assistant acknowledgements as new requirements.
                            - Use YYYY-MM-DD for dates.
                            - Represent proposition arguments as strings.
                            - Return {"moves": []} when no relevant dialogue move is present.
                            - Return only valid JSON.
                            - Use "answer" only when a current question is provided.
                            - When there is no current question, use "provide", "add", or "correct" for travel requirements.
                            - Use "provide" when the user states a requirement for the first time.
                            - Use "correct" when the user revises an existing requirement.
                            - Never use "answer" for a standalone requirement when the current question is "(none)".
                            - For travelers, identify the total number of people traveling,
                            including the user.
                            - When family members or groups are mentioned, calculate the
                            total number of travelers if the information is clear.
                            - Use existing traveler information when interpreting additions
                            or corrections, and avoid double-counting people.
                            - Represent the final traveler count as a numeric string
                            (e.g., "7", not "seven" or "family").
                            - Use recent dialogue context to understand incomplete or fragmented utterances.
                            - Extract updates only from the current utterance, using earlier turns for context. Do not reapply old requirements.

                            Move formats:

                            Ask:
                            {"type":"ask","content":{"type":"whq","predicate":"budget"}}

                            Answer:
                            {"type":"answer","content":"900"}

                            Provide, add, correct:
                            {"type":"provide","content":{"predicate":"destination","argument":"Rome"}}

                            Return all moves inside a "moves" array.`
                                        },
                                        {
                                            role: "user",
                                            content: `Current facts:
                            ${currentFacts}

                            Current question:
                            ${currentQuestion ?? "(none)"}

                            Recent dialogue context:
                            ${recentContext || "(none)"}

                            Current speaker:
                            ${speaker}

                            Current utterance:
                            ${utterance}`
                                        }
                                    ]
                                });

    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw new Error("Ollama returned an empty NLU response.");
    }

    const parsed: unknown = JSON.parse(content);
    // Normalize a single dialogue move into the expected moves array.
const normalized =
    typeof parsed === "object" &&
    parsed !== null &&
    !Array.isArray(parsed) &&
    "type" in parsed
        ? { moves: [parsed] }
        : parsed;

        if (
            typeof normalized !== "object" ||
            normalized === null ||
            !("moves" in normalized) ||
            !Array.isArray(normalized.moves)
        ) {
            throw new Error("Invalid NLU response: expected a moves array.");
        }

    const moves: TravelMove[] = [];

    for (const raw of normalized.moves) {
        if (typeof raw !== "object" || raw === null) {
            console.warn("Rejected invalid NLU move:", raw);
            continue;
        }

        const move = raw as Record<string, unknown>;
        const type = move.type;
        const content = move.content;

        if (type === "ask") {
            if (
                typeof content === "object" &&
                content !== null &&
                "type" in content &&
                content.type === "whq" &&
                "predicate" in content &&
                typeof content.predicate === "string" &&
                validPredicates.includes(content.predicate)
            ) {
                moves.push({
                    type: "ask",
                    content: {
                        type: "whq",
                        predicate: content.predicate
                    }
                });
                continue;
            }
        }

        if (type === "answer") {
            if (typeof content === "string") {
                moves.push({ type: "answer", content });
                continue;
            }

            if (
                typeof content === "object" &&
                content !== null &&
                "predicate" in content &&
                "argument" in content &&
                typeof content.predicate === "string" &&
                validPredicates.includes(content.predicate) &&
                typeof content.argument === "string"
            ) {
                moves.push({
                    type: "answer",
                    content: {
                        predicate: content.predicate,
                        argument: content.argument
                    }
                });
                continue;
            }
        }

        if (
            type === "provide" ||
            type === "add" ||
            type === "correct"
        ) {
            if (
                typeof content === "object" &&
                content !== null &&
                "predicate" in content &&
                "argument" in content &&
                typeof content.predicate === "string" &&
                validPredicates.includes(content.predicate) &&
                typeof content.argument === "string"
            ) {
                const numericPredicates = ["budget", "durationDays", "travelers"];

                let argument = content.argument;
                
                if (numericPredicates.includes(content.predicate)) {
                    argument = argument.replace(/[€,\s]/g, "");
                
                    if (
                        argument === "" ||
                        !Number.isFinite(Number(argument))
                    ) {
                        console.warn("Rejected invalid numeric argument:", raw);
                        continue;
                    }
                }
                
                moves.push({
                    type,
                    content: {
                        predicate: content.predicate,
                        argument
                    }
                });
                continue;
            }
        }

        console.warn("Rejected invalid NLU move:", raw);
    }

    return moves;
}
