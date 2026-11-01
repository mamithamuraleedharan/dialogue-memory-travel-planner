import OpenAI from "openai";

export const ollamaClient = new OpenAI({
    baseURL: "http://localhost:11434/v1/",
    apiKey: "ollama",
});