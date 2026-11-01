import { test, expect } from "vitest";
import { addTurn } from "../src/memory/fullHistory";
import type { DialogueTurn } from "../src/dialogue/types";

test("should append a new turn", () => {
    const history: DialogueTurn[] = [
        {
            speaker: "user",
            message: "I want to visit Paris."
        }
    ];
    
    const newTurn: DialogueTurn = {
        speaker: "user",
        message: "My budget is €800."
    };
    const updatedHistory = addTurn(history, newTurn);
    expect(updatedHistory).toEqual([...history, newTurn]);
    expect(history).toHaveLength(1);
});

