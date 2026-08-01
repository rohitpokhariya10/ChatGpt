"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = exports.getConversationTitle = void 0;
const mistralai_1 = require("@langchain/mistralai");
const env_js_1 = require("../config/env.js");
const langchain_1 = require("langchain");
const z = __importStar(require("zod"));
const smallModel = new mistralai_1.ChatMistralAI({
    apiKey: env_js_1.env.mistralapi,
    model: "mistral-small-latest"
});
const mediumModel = new mistralai_1.ChatMistralAI({
    apiKey: env_js_1.env.mistralapi,
    model: "mistral-medium-latest"
});
const getConversationTitle = async (message) => {
    const agent = (0, langchain_1.createAgent)({
        model: smallModel,
        responseFormat: z.object({
            title: z.string().max(30).describe("The title of the conversation, max 30 characters"),
        }),
    });
    const response = await agent.invoke({
        messages: [
            new langchain_1.HumanMessage(message)
        ]
    });
    return response.structuredResponse.title;
};
exports.getConversationTitle = getConversationTitle;
const getStream = async (message) => {
    const chunk = await mediumModel.stream(message);
    //console.log("chunk-->", chunk)
    return chunk;
};
exports.getStream = getStream;
