import type { TravelInformationState } from "./sisuTypes";

export function initialTravelIS(): TravelInformationState {
    return {
        shared: {
            com: [], //stores current travel requirements
            qud: []
        }
    };
}