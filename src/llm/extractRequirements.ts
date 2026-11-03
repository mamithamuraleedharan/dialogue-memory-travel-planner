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
                            Rules:
                            - Use the latest value if a requirement was corrected.
                            - Preserve requirements that were not corrected.
                            - Use YYYY-MM-DD for dates.
                            - Use numbers for budget, durationDays, and travelers.
                            - Use an array of strings for interests.
                            - Omit fields that were never mentioned.
                            - Return only valid JSON, without explanations or markdown.`
            },
            ...messages
        ],
        response_format: { type: "json_object" }, // result as json output
        temperature: 0 // most accurate result
    });
    const content = response.choices[0]?.message?.content; // extract only the json part
    
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