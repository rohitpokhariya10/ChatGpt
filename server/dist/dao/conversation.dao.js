"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationDao = void 0;
const conversation_model_1 = require("./models/conversation.model");
class ConverstaionDao {
    async createConversation(title, user) {
        return await conversation_model_1.conversationModel.create({ title, user });
    }
}
exports.conversationDao = new ConverstaionDao();
