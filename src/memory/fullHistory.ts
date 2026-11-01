import type { DialogueTurn } from "../dialogue/types";


export function addTurn(
history: DialogueTurn[],
    turn: DialogueTurn // new message we are adding
): DialogueTurn[] { 
    return [...history, turn];
}
