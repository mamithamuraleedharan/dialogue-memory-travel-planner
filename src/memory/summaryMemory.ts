import type { DialogueTurn } from "../dialogue/types";
import { ollamaClient } from "../llm/ollamaClient";

export async function updateSummary(
        previousSummary: string,
        newTurns: DialogueTurn[] // sliced dialgoue which is 1 pair of user-assistant conv
    ): Promise<string> {
    
    const dialogueText = newTurns
    .map((turn) => `${turn.speaker}: ${turn.message}`)
    .join("\n");
    
    const response = await ollamaClient.chat.completions.create({
        model: "llama3.1",
        temperature: 1,
        messages: [
            {
                role: "system",
                content: `You maintain a concise rolling summary of a travel-planning conversation.
    
    Rules:
    - Preserve important travel requirements.
    - Preserve information from earlier turns unless corrected.
    - When the user corrects a requirement, use the latest value.
    - Preserve destination, dates, duration, budget, interests, transport, and travelers when mentioned.
    - Do not invent missing information.
    - Write a concise natural-language summary, not JSON.`
            },
            {
                role: "user",
                content: `Previous summary:
    ${previousSummary || "(No previous summary)"}
    
    New dialogue turns:
${dialogueText}
    
    Write the updated summary.`
            }
        ]
    });
    const updatedSummary = response.choices[0]?.message?.content;

if (!updatedSummary) {
    throw new Error("Ollama returned an empty summary.");
}

return updatedSummary;
}