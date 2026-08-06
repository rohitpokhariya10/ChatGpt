import { Schema, model, type InferSchemaType, Types } from "mongoose";

const messageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true
    },
    author: {
        type: String,
        enum: ["user", "ai", "tool"],
        default: "user",
    },
    content: {
        type: String,
        default: "",
        trim: true,
    },
    toolCalls: [
        {
            name: String,
            args: Object,
            id: String,
        }
    ],
    toolCallId: String,
}, {
    timestamps: true
});

export type MessageDocument = InferSchemaType<typeof messageSchema> & {
    _id: Types.ObjectId;
};

export const MessageModel = model("Message", messageSchema);
