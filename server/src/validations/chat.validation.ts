import { body } from "express-validator";



export const sendMessageValidation = [
    body("message").isString().notEmpty().withMessage("Message is required"),
    body("conversationId")
    .optional()
    .isString()
    .withMessage("Conversation ID must be a string")
    .isMongoId()
    .withMessage("Conversation ID must be a valid MongoDB ObjectId")
]