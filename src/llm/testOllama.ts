import { ollamaClient } from "./ollamaClient";

async function testConnection() {
    const response = await ollamaClient.chat.completions.create({
        model: "llama3.1",
        messages: [
            {role: "user",
            content: "Say hello in one short sentence."}
        ]
    });
    console.log(response.choices[0].message.content);
}
testConnection().catch(console.error);
