
import { Request , Response } from "express"
import { getConversationTitle, getStream } from "../service/ai.service";
import { conversationModel } from "../dao/models/conversation.model";
import { conversationDao } from "../dao/conversation.dao";
import { messageDao } from "../dao/message.dao";



export const chatCotroller = async (req:Request , res:Response)=>{
    let {message , conversationId} = req.body;
    const user = req.user
    if(!user){
        throw new Error("Unauthorized user")
    }
    if(!conversationId){
        const title = await getConversationTitle(message);
        const newConversation = await conversationDao.createConversation(title , user?.userId);
        console.log("newConversationId-->" , newConversation._id)
        conversationId = newConversation._id;
        
    }
    let stream = await getStream(message);
    //Human message save in DB
     await messageDao.createMessage(conversationId , message , "Human");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-Cache");
    res.setHeader("Connection" , "keep-alive");
    
    let AI_MESSAGE = "";
    for await(let chunk of stream){
        res.write(`data:${chunk.content}\n\n`)
    //    console.log("chuuunk--->", chunk.content)
        AI_MESSAGE += chunk.content;
    }
    //Save AI Response in DB
    await messageDao.createMessage(conversationId , AI_MESSAGE, "Ai")
  
    res.end()

    

}