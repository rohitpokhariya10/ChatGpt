"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Conversation",
        index: true,
    },
    content: {
        type: String,
        require: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["Ai", "Human"],
        default: "Human"
    }
}, {
    timestamps: true,
});
exports.messageModel = (0, mongoose_1.model)("messages", messageSchema);
