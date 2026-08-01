import {messageModel} from "../dao/models/message.model.js"
import { MessageRole } from "../types/chat.js";

class MessageDao{
    async createMessage(conversationId:string , content:string , role:MessageRole){
        console.log("ci", conversationId)
        return await messageModel.create({conversationId , content , role})

    }
}
export const messageDao = new MessageDao();