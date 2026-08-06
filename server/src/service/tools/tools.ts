import { tool } from "langchain";
import * as z from "zod";
import { contextDao } from "../../dao/context.dao.js";
import { getResultFromWeb } from "../web.service.js";
import { query } from "express-validator";

export function createMemoryTools(userId: string) {
  const getMemoryTool = tool(
    async () => {
      return contextDao.readContext(userId);
    },
    {
      name: "getMemory",

      description:
        "Retrieves the authenticated user's saved long-term memory and preferences.",

      schema: z.object({}),
    },
  );

  // 2 Tool for Update Memory
  const updateMemoryTool = tool(
    async ({ description }: { description: string }) => {

      // console.log("UPDATE MEMORY TOOL CALLED:", {
      //   userId,
      //   description,
      // });

      await contextDao.updateContext({
        userId,
        description,
      });

      return "User memory updated successfully.";
    },
    {
      name: "updateMemory",

      description:
        "Updates the authenticated user's long-term memory. Use this only for durable facts, preferences, goals, or background information that may be useful in future conversations.",

      schema: z.object({
        description: z
          .string()
          .min(5)
          .describe(
            "The complete updated user memory. Preserve useful existing facts and add the new durable information.",
          ),
      }),
    },
  );

  return {
    getMemoryTool,
    updateMemoryTool,
  };
}

export const getWebResultTool = tool(
  async ({ query }) => {
    return getResultFromWeb({ query });
  },
  {
    name:"getWebResultTool",
    description:"This tool is used to access Internet when Ai didnot know the answer",
    schema:z.object({
      query:z.string().min(2).describe("The search query to find information on the internet.")
    })
  }
)
