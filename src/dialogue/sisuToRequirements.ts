
import type { TravelInformationState } from "./sisuTypes";
import type { TravelRequirements } from "./types";

export function sisuToRequirements(
    state: TravelInformationState
): TravelRequirements {
    const requirements: TravelRequirements = {};

    for (const fact of state.shared.com) {

        // Convert numeric requirements
        if (
            fact.predicate === "budget" ||
            fact.predicate === "durationDays" ||
            fact.predicate === "travelers"
        ) {
            const value = Number(fact.argument.replace(/[€,\s]/g, ""));

            if (!Number.isFinite(value)) {
                throw new Error(`Invalid numeric value: ${fact.argument}`);
            }

            requirements[fact.predicate] = value;
        }

        // Convert string requirements
        if (fact.predicate === "destination") {
            requirements.destination = fact.argument;
        }

        if (fact.predicate === "startDate") {
            requirements.startDate = fact.argument;
        }

        if (fact.predicate === "transport") {
            requirements.transport = fact.argument;
        }

        // Convert interests into an array
        if (fact.predicate === "interests") {
            const interests = fact.argument
                .split(/\s+and\s+|,/i)
                .map((interest) => interest.trim())
                .filter((interest) => interest.length > 0);

            requirements.interests = [
                ...(requirements.interests ?? []),
                ...interests
            ];
        }
    }

    return requirements;
}
