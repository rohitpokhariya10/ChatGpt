import { conversationModel } from "./models/conversation.model";

class ConverstaionDao {
  async createConversation(title: string, user: string) {
    return await conversationModel.create({ title, user });
  }
}
export const conversationDao = new ConverstaionDao();