import type { DialogueTurn } from "../dialogue/types";


export function addTurn(
                history: DialogueTurn[], // converstation history
                turn: DialogueTurn // one new turn
): DialogueTurn[] { 
    return [...history, turn];
}
