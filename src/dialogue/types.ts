
export interface DialogueTurn{
    speaker : "user" | "assistant";
    message : string;
}

export interface TravelRequirements{
    destination? : string;
    startDate? : string ;
    durationDays ?: number;
    budget? : number;
    interests? : string[];
    transport? : string;
    travelers? : number;
}

export interface DialogueTestCase{
    id : string;
    category: "long_correction";
    dialogue : DialogueTurn[];
    expectedRequirements: TravelRequirements;
}