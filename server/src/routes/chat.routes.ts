import {Router} from "express";
import { sendMessageValidation } from "../validations/chat.validation.js";
import { validateRequest } from "../validations/validate-request.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { chatCotroller } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/conversation" , authMiddleware, sendMessageValidation, validateRequest, chatCotroller)



export {chatRouter};