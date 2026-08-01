"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDao = void 0;
const message_model_js_1 = require("../dao/models/message.model.js");
class MessageDao {
    async createMessage(conversationId, content, role) {
        console.log("ci", conversationId);
        return await message_model_js_1.messageModel.create({ conversationId, content, role });
    }
}
exports.messageDao = new MessageDao();
