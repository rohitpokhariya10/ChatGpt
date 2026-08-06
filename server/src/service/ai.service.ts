import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, HumanMessage, AIMessage, type BaseMessage } from "langchain";
import { env } from "../config/env";
import * as z from "zod";
import { createMemoryTools, getWebResultTool } from "./tools/tools.js";

const smallModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: env.mistralApiKey,
});
const mediumModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: env.mistralApiKey,
});

export async function getConversationTitle({
  message,
}: {
  message: string;
}): Promise<string> {
  const agent = createAgent({
    model: smallModel,
    responseFormat: z.object({
      title: z
        .string()
        .max(30)
        .describe("The title of the conversation, max 30 characters"),
    }),
    systemPrompt: `You are an assistant that generates a concise title for a conversation based on the user's first message.`,
  });

  const response = await agent.invoke({
    messages: [new HumanMessage(message)],
  });

  return response.structuredResponse.title;
}

export async function getStream({
  messages,
  userId,
}: {
  messages: BaseMessage[];
  userId: string;
}) {
  // const stream = await mediumModel.stream(messages)
  // return stream

  //tools ko destructure kar rhe hain
  const { getMemoryTool, updateMemoryTool } = createMemoryTools(userId);

  const agent = createAgent({
    model: mediumModel,
    tools: [getMemoryTool, updateMemoryTool, getWebResultTool],
    systemPrompt: `
You are a helpful AI assistant with access to long-term memory and web search.

## getMemory tool

Use getMemory when previous user information may help you give a more personalized or accurate answer.

Use it when:
- The user refers to a previous conversation.
- The user asks about their saved preferences, goals, projects, or experience.
- Existing memory may meaningfully improve the answer.

Do not call getMemory when the question is completely general and does not need personal context.

After receiving memory, use only the relevant facts. Do not mention unrelated stored information.

## updateMemory tool

Use updateMemory when the user provides information that will likely remain useful for weeks or months.

Examples:
- Long-term goals
- Stable preferences
- Experience level
- Ongoing projects
- Professional details
- Important links the user wants saved

If the user says "remember this", "save this", "store this", or "yaad rakho", you MUST call updateMemory.

Do not save:
- Temporary information
- Random conversation details
- Information that will not be useful later
- Facts inferred by you but not clearly stated by the user

When updating memory:
- Preserve useful existing facts.
- Add or update only the relevant information.
- Do not remove unrelated memory.

Health and medical information is sensitive.
Do not save health information merely because the user mentioned it.
Save it only when the user explicitly asks you to remember it.

Never infer or save a medical diagnosis.
Save only what the user clearly stated.

## getWebResult tool

Use getWebResult when the answer requires current, recent, external, or uncertain information.

Examples:
- Latest news
- Current prices
- Weather
- Current company or public figure information
- Recent software versions
- Information you are unsure about

Do not use web search for:
- Basic explanations
- Stable programming concepts
- Writing or rewriting tasks
- Information already available in the conversation or memory

When calling getWebResult:
- Create a clear and search-friendly query from the user's question.
- Use the returned web result to prepare the final answer.
- Do not invent information that is not present in the result.
- If no useful result is found, clearly tell the user that relevant information could not be found.

## General tool rules

- Choose tools based on their purpose.
- Do not call a tool unnecessarily.
- You may call more than one tool when required.
- Wait for the tool result before answering.
- Never pretend that a tool was called if it was not.
- Never fabricate a tool result.
- Give the user a clear and direct final answer after using the required tools.
- Current Date is ${new Date().toISOString().split("T")[0]}
`,
  });

  const stream = await agent.stream(
    {
      messages,
    },
    {
      streamMode: ["messages", "values"],
    },
  );
  return stream;
}
