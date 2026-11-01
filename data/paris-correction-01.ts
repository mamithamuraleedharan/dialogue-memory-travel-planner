
import type { DialogueTestCase } from "../src/dialogue/types";

export const parisCorrection01: DialogueTestCase = {
  id: "paris-correction-01",
  category: "short_correction",

  dialogue: [
    {
      speaker: "user",
      message: "I'm planning a trip to Paris."
    },
    {
      speaker: "assistant",
      message: "Sounds good! Tell me more about your trip."
    },
    {
      speaker: "user",
      message: "I'm thinking of travelling on December 10, 2026."
    },
    {
      speaker: "assistant",
      message: "Got it."
    },
    {
      speaker: "user",
      message: "We'll be there for five days."
    },
    {
      speaker: "assistant",
      message: "Okay."
    },
    {
      speaker: "user",
      message: "There will be two of us."
    },
    {
      speaker: "assistant",
      message: "Understood."
    },
    {
      speaker: "user",
      message: "Our total budget is €800."
    },
    {
      speaker: "assistant",
      message: "Got it."
    },
    {
      speaker: "user",
      message: "We enjoy museums and historical places."
    },
    {
      speaker: "assistant",
      message: "I'll keep those interests in mind."
    },
    {
      speaker: "user",
      message: "We prefer using public transport."
    },
    {
      speaker: "assistant",
      message: "Understood."
    },
    {
      speaker: "user",
      message: "Actually, three people will be travelling instead of two."
    },
    {
      speaker: "assistant",
      message: "Okay, I'll update the number of travelers."
    },
    {
      speaker: "user",
      message: "Also, our total budget has changed to €600."
    },
    {
      speaker: "assistant",
      message: "Understood, I'll update the budget."
    },
    {
      speaker: "user",
      message: "Please create our travel itinerary."
    }
  ],

  expectedRequirements: {
    destination: "Paris",
    startDate: "2026-12-10",
    durationDays: 5,
    budget: 600,
    interests: ["museums", "history"],
    transport: "public transport",
    travelers: 3
  }
};
