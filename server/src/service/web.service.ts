import { tavily} from "@tavily/core";
import {env} from "../config/env.js"

const tavilyClient = tavily({apiKey :  env.tavilyApiKey});

export const getResultFromWeb = ({query}:{query: string}) =>{
 let result = tavilyClient.search(query);
 return result;
}