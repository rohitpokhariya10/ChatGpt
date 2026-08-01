"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatCotroller = void 0;
const ai_service_1 = require("../service/ai.service");
const conversation_dao_1 = require("../dao/conversation.dao");
const message_dao_1 = require("../dao/message.dao");
const chatCotroller = async (req, res) => {
    let { message, conversationId } = req.body;
    const user = req.user;
    if (!user) {
        throw new Error("Unauthorized user");
    }
    if (!conversationId) {
        const title = await (0, ai_service_1.getConversationTitle)(message);
        const newConversation = await conversation_dao_1.conversationDao.createConversation(title, user?.userId);
        console.log("newConversationId-->", newConversation._id);
        conversationId = newConversation._id;
    }
    let stream = await (0, ai_service_1.getStream)(message);
    //Human message save in DB
    await message_dao_1.messageDao.createMessage(conversationId, message, "Human");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-Cache");
    res.setHeader("Connection", "keep-alive");
    let AI_MESSAGE = "";
    for await (let chunk of stream) {
        res.write(`data:${chunk.content}\n\n`);
        //    console.log("chuuunk--->", chunk.content)
        AI_MESSAGE += chunk.content;
    }
    //Save AI Response in DB
    await message_dao_1.messageDao.createMessage(conversationId, AI_MESSAGE, "Ai");
    res.end();
};
exports.chatCotroller = chatCotroller;
