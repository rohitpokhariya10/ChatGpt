import { tavily } from "@tavily/core";
import { env } from "../config/env.js";

const tavilyClient = tavily({ apiKey: env.tavilyApiKey });

export const getResultFromWeb = async ({ query }: { query: string }) => {
  return tavilyClient.search(query);
};
