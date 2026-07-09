import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "meow",
  baseURL: "http://localhost:8787/v1",
});

async function main() {
  console.log("--- Models ---");
  const models = await client.models.list();
  console.log(models.data.length, "models");

  console.log("--- Chat ---");
  const chat = await client.chat.completions.create({
    model: "meowgpt",
    messages: [{ role: "user", content: "hello" }],
  });
  console.log(chat.choices[0]?.message.content);

  console.log("--- Stream ---");
  const stream = await client.chat.completions.create({
    model: "meowgpt",
    messages: [{ role: "user", content: "hello" }],
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
  }
  console.log("");

  console.log("--- Image ---");
  const image = await client.images.generate({
    model: "meowgpt",
    prompt: "a cat",
  });
  console.log(image.data?.[0]?.url);
}

main().catch(console.error);
