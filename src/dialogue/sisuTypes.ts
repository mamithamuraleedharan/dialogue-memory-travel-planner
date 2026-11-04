export type Proposition = {
    predicate: string;
    argument: string;
};

export type Question = WhQuestion;

type WhQuestion = {
    type: "whq";
    predicate: string;
};


export type ShortAnswer = string;

export interface AskMove {
    type: "ask";
    content: Question;
}

export interface AnswerMove {
    type: "answer";
    content: Proposition | ShortAnswer;
}


export interface TravelInformationState {
    shared: {
        com: Proposition[];
        qud: Question[];
    };
}

export type TravelMove =
    | {
        type: "provide" | "add" | "correct";
        content: Proposition;
    }
    | AskMove
    | AnswerMove;