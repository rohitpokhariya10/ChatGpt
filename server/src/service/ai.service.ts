import {ChatMistralAI} from "@langchain/mistralai"
import {env} from "../config/env.js"
import {createAgent , HumanMessage} from "langchain"
import * as z from "zod"

const smallModel = new ChatMistralAI({
    apiKey:env.mistralapi,
    model:"mistral-small-latest"
});
const mediumModel = new ChatMistralAI({
    apiKey:env.mistralapi,
    model:"mistral-medium-latest"
});

export const getConversationTitle = async (message:string)=>{

    const agent = createAgent({
        model:smallModel,
        responseFormat:z.object({
            title:z.string().max(30).describe("The title of the conversation, max 30 characters"),
        }),
    });

    const response = await agent.invoke({
        messages:[
            new HumanMessage(message)
        ]
    })
    return response.structuredResponse.title;

}
export const getStream = async (message:string)=>{
   const chunk = await mediumModel.stream(message);
   //console.log("chunk-->", chunk)
   return chunk;


}