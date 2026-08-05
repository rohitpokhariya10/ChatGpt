import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { RequestMessage } from "../types/chat";
import { getConversationTitle, getStream } from "../service/ai.service";
import { conversationDao } from "../dao/conversation.dao";
import { messageDao } from "../dao/message.dao";
import { ApiError } from "../utils/api-error";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

export const listConversations = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const conversations = await conversationDao.findConversationsByUser(
      user.userId,
    );

    res.status(200).json({
      conversations: conversations.map((conversation) => ({
        id: conversation._id.toString(),
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      })),
    });
  },
);

/*

*/
export const getConversation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const conversation = await conversationDao.findConversationByIdAndUser(
      String(req.params.conversationId),
      user.userId,
    );
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    const messages = await messageDao.findMessagesByConversation(
      conversation._id.toString(),
    );

    res.status(200).json({
      conversation: {
        id: conversation._id.toString(),
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: messages.map((message) => ({
          id: message._id.toString(),
          author: message.author,
          content: message.content,
          createdAt: message.createdAt,
        })),
      },
    });
  },
);

/**
 * POST /api/v1/chat/conversation
 *
 * req.body = {
 *     message: string,
 *     conversationId?: string
 * }
 */
export const chatController = asyncHandler(
  async (
    req: Request<{}, {}, RequestMessage>,
    res: Response,
  ): Promise<void> => {
    let { message, conversationId } = req.body;
    let conversationTitle: string;
    const user = req.user; // Assuming user is attached to the request object after authentication

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    // CASE 1
    if (!conversationId) {
      conversationTitle = await getConversationTitle({ message });
      const newConversation = await conversationDao.createConversation({
        user: user.userId,
        title: conversationTitle,
      });

      conversationId = newConversation._id.toString();
    } else {
      //CASE 2
      const conversation = await conversationDao.findConversationByIdAndUser(
        conversationId,
        user.userId,
      );
      if (!conversation) {
        throw new ApiError(404, "Conversation not found");
      }
      conversationTitle = conversation.title;
    }

    await messageDao.createMessage({
      content: message,
      author: "user",
      conversation: conversationId,
    });
    //Fetch all messsages of a particular conversationId
    const databaseMessages =
      await messageDao.findMessagesByConversation(conversationId);

    const messages = databaseMessages.map((message) => {
      if (message.author === "user") return new HumanMessage(message.content);
      else return new AIMessage(message.content);
    });

    const stream = await getStream({ messages, userId: user.userId });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Conversation-Id", conversationId);
    res.setHeader(
      "X-Conversation-Title",
      encodeURIComponent(conversationTitle),
    );

    let aiMessage: string = "";

    for await (const [chunk, metaData] of stream) {
      //Simple reason: agent stream mein sirf final AI answer nahi, internal tool messages bhi aate hain. Hume frontend par sirf AI ka visible answer bhejna hai.
      if (chunk.type !== "ai") {
        continue;
      }

      if (!chunk.text) {
        continue;
      }
      res.write(`data: ${JSON.stringify(chunk.text)}\n\n`);

      aiMessage += chunk.text;
    }

    await messageDao.createMessage({
      content: aiMessage,
      author: "ai",
      conversation: conversationId,
    });

    res.end(); //Saare chunks bhej diye hain, response complete hai.
  },
);
