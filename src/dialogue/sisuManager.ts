
import { interpretTravelUtterance } from "./sisuNlug";
import { applyTravelMove } from "./sisuRules";
import type { TravelInformationState } from "./sisuTypes";


export async function processTravelUtterance(
    state: TravelInformationState,
    utterance: string,
    speaker: "user" | "assistant" = "user",
    recentContext: string = ""
): Promise<TravelInformationState> {

    const currentFacts = state.shared.com
        .map((fact) => `${fact.predicate} = ${fact.argument}`)
        .join("\n");

    const currentQuestion = state.shared.qud[0]?.predicate;

    const moves = await interpretTravelUtterance(
        utterance,
        currentFacts,
        currentQuestion,
        speaker,
        recentContext
    );

    console.log("Validated dialogue moves:", moves);

    let updatedState = state;

    for (const move of moves) {
        updatedState = applyTravelMove(updatedState, move);
    }

    return updatedState;
}

