import { ollamaClient } from "./ollamaClient";
import type { TravelRequirements } from "../dialogue/types";


// function for getting the travel requirement from llm
export async function extractRequirements(
    messages: { 
        role: "user" | "assistant" | "system"; 
        content: string 
    }[]): Promise<TravelRequirements> {
    
    const response = await ollamaClient.chat.completions.create({
        model: "llama3.1",
        messages: [
            {
                role: "system",
                content: `Extract the current travel requirements from the conversation.
                                Return a JSON object containing these fields when mentioned:
                                destination, startDate, durationDays, budget, interests, transport, travelers.

                                Formatting:
                                - Dates: YYYY-MM-DD
                                - Budget, durationDays, travelers: numbers
                                - Interests: array of strings
                                - Omit fields that were not mentioned.
                                - Return only valid JSON.`
            },
            ...messages
        ],
        response_format: { type: "json_object" }, // result as json output
        temperature: 0 // 0- most accurate
    });
    const content = response.choices[0]?.message?.content; // extract only the json part
    console.log("Raw extraction response:", content);
    
    // error checks
    if (!content) {
        throw new Error("Ollama returned an empty response.");
    } 
    const parsed: unknown = JSON.parse(content);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            throw new Error("Ollama returned an invalid requirements object.");
        }
        
const requirements = parsed as Record<string, unknown>;

// validating all the required field before returning the values
const validated: TravelRequirements = {};
const stringFields = ["destination", "startDate", "transport"] as const;
const numberFields = ["durationDays", "budget", "travelers"] as const;

// for "destination", "startDate", "transport"
for (const field of stringFields) {
    const value = requirements[field];
    if (value !== undefined) {
        if (typeof value !== "string") {
            throw new Error(`Invalid value for ${field}`);}
        validated[field] = value;
    }
}
// for "durationDays", "budget", "travelers"
for (const field of numberFields) {
    const value = requirements[field];
    if (value !== undefined) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new Error(`Invalid value for ${field}`); }
        validated[field] = value;  }}

    // check for interests
if (requirements.interests !== undefined) {
    if (
        !Array.isArray(requirements.interests) ||
        !requirements.interests.every(
            (interest: unknown) => typeof interest === "string"
        )
    ) {
        throw new Error("Invalid interests array");
    }

    validated.interests = requirements.interests as string[];
}
return validated;}