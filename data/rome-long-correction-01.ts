import type { DialogueTestCase } from "../src/dialogue/types";

export const romeLongCorrection01: DialogueTestCase = {
    
    id: "rome-long-correction-01",
    
    category: "long_correction",
    
    dialogue: [
        { speaker: "user", message: "I'm thinking about taking a trip to Rome." },
        { speaker: "assistant", message: "That sounds exciting! Have you decided when you'd like to go?" },
        { speaker: "user", message: "We're planning to leave on March 12, 2027." },
        { speaker: "assistant", message: "March sounds like a nice time to visit. How long are you staying?" },
        { speaker: "user", message: "Probably six days." },
        { speaker: "assistant", message: "Six days should give you time to explore quite a bit." },
        { speaker: "user", message: "It'll just be me and my partner." },
        { speaker: "assistant", message: "Okay, so two people traveling together." },
        { speaker: "user", message: "We can spend around €1,200 in total." },
        { speaker: "assistant", message: "Understood. I'll keep that budget in mind." },     
        { speaker: "user", message: "We're really interested in museums and architecture." },
        { speaker: "assistant", message: "Rome has plenty of museums and beautiful historic buildings." },
        { speaker: "user", message: "I've always wanted to see the Colosseum in person." },
        { speaker: "assistant", message: "The Colosseum is one of Rome's most famous landmarks." },
        { speaker: "user", message: "Would it be easy to get around without renting a car?" },
        { speaker: "assistant", message: "Yes, Rome has buses, metro lines, and trams." },
        { speaker: "user", message: "Good, we'd prefer using public transport throughout the trip." },
        { speaker: "assistant", message: "That should work well for getting around the city." },
        { speaker: "user", message: "Do you think we should book museum tickets in advance?" },
        { speaker: "assistant", message: "Booking popular attractions in advance is usually a good idea." }, 
        { speaker: "user", message: "I've heard the food in Rome is amazing, especially the pasta." },
        { speaker: "assistant", message: "Roman pasta dishes are definitely worth trying." },
        { speaker: "user", message: "Is the Trevi Fountain usually crowded?" },
        { speaker: "assistant", message: "It can get quite busy, especially during popular visiting hours." },
        { speaker: "user", message: "Maybe we should visit early in the morning then." },
        { speaker: "assistant", message: "That could help you avoid some of the crowds." },
        { speaker: "user", message: "I also want to spend some time just walking around the old streets." },
        { speaker: "assistant", message: "Exploring Rome on foot can be a lovely experience." },
        { speaker: "user", message: "By the way, do most restaurants accept card payments?" },
        { speaker: "assistant", message: "Many do, although carrying a little cash can still be useful." },    
        { speaker: "user", message: "Oh, wait. I just checked our calendar. We can't leave on March 12 after all." },
        { speaker: "assistant", message: "No problem. Have you decided on a different date?" },
        { speaker: "user", message: "Sorry, I meant March 15, 2027. That works better for us." },
        { speaker: "assistant", message: "Okay, I'll use March 15 as your departure date." },
        { speaker: "user", message: "There's another thing. We might need to reduce our spending a little." },
        { speaker: "assistant", message: "Of course. What budget would you prefer?" },
        { speaker: "user", message: "Let's bring it down to €900 for the whole trip." },
        { speaker: "assistant", message: "Understood. I'll adjust the budget." },
        { speaker: "user", message: "Oh, and my sister has decided to join us too, so there'll be three of us now." },
        { speaker: "assistant", message: "Got it. I'll update the number of travelers." },
        { speaker: "user", message: "Do you think we should stay somewhere near the city centre?" },
        { speaker: "assistant", message: "Staying centrally could make it easier to reach many attractions." },
        { speaker: "user", message: "I was also wondering whether the Vatican Museums get very crowded." },
        { speaker: "assistant", message: "They can be busy, so booking ahead is worth considering." },
        { speaker: "user", message: "Would it be better to visit the Colosseum in the morning or afternoon?" },
        { speaker: "assistant", message: "Morning visits can sometimes be more comfortable and less crowded." },
        { speaker: "user", message: "We should probably leave some free time instead of planning every hour." },
        { speaker: "assistant", message: "That sounds sensible. A flexible schedule can make the trip more enjoyable." },
        { speaker: "user", message: "Alright, I think that's everything. Can you summarize our current travel plans?" },
        { speaker: "assistant", message: "Of course, I'll put together a summary of your travel requirements." }

    ],
    
    expectedRequirements: {
        destination: "Rome",
        startDate: "2027-03-15",
        durationDays: 6,
        budget: 900,
        travelers: 3,
        transport: "public transport",
        interests: ["museums", "architecture"]
    }
};