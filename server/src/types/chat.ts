export type RequestMessage = {
  message: string;
  conversationId?: string;
};

export type StoredToolCall = {
  id: string;
  name: string;
  args: Record<string, unknown>;
};

export type Message = {
  author: "user" | "ai" | "tool";
  content: string;
  conversation: string;
  toolCalls?: StoredToolCall[];
  toolCallId?: string;
};
