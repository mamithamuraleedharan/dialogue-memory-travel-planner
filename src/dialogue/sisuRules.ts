
import type { TravelInformationState, TravelMove } from "./sisuTypes";
import { relevant, combine, resolves } from "./sisuSemantics";

export function applyTravelMove(
    state: TravelInformationState,
    move: TravelMove
): TravelInformationState {
    
    
    if (move.type === "provide") {
        const updatedCommitments = state.shared.com.filter(
            (fact) => fact.predicate !== move.content.predicate
        );
        return {
            ...state,
            shared: {
                ...state.shared,
                com: [...updatedCommitments, move.content]
            }
        };
    }
    
    
    if (move.type === "correct") {
        const updatedCommitments = state.shared.com.filter(
            (fact) => fact.predicate !== move.content.predicate
        );
        return {
            ...state,
            shared: {
                ...state.shared,
                com: [...updatedCommitments, move.content]
            }
        };
    }

    if (move.type === "add") {
        const alreadyExists = state.shared.com.some(
            (fact) =>
                fact.predicate === move.content.predicate &&
                fact.argument.trim().toLowerCase() ===
                    move.content.argument.trim().toLowerCase()
        );
        if (alreadyExists) {
            return state;
        }
        return {
            ...state,
            shared: {
                ...state.shared,
                com: [...state.shared.com, move.content]
            }
        };
    }
    
    
    if (move.type === "ask") {
        const topQUD = state.shared.qud[0];
    
        if (
            topQUD &&
            topQUD.type === move.content.type &&
            topQUD.predicate === move.content.predicate
        ) {
            return state;
        }
    
        return {
            ...state,
            shared: {
                ...state.shared,
                qud: [move.content, ...state.shared.qud]
            }
        };
    }
    
if (move.type === "answer") {
    const topQUD = state.shared.qud[0];

    if (!topQUD || !relevant(move.content, topQUD)) {
        return state;
    }

    const proposition = combine(topQUD, move.content);

    const updatedCommitments = state.shared.com.filter(
        (fact) => fact.predicate !== proposition.predicate
    );

    const updatedState: TravelInformationState = {
        ...state,
        shared: {
            ...state.shared,
            com: [...updatedCommitments, proposition]
        }
    };

    if (resolves(proposition, topQUD)) {
        return {
            ...updatedState,
            shared: {
                ...updatedState.shared,
                qud: updatedState.shared.qud.slice(1)
            }
        };
    }

    return updatedState;
}

    return state;
}
