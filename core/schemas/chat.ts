import { Entity, Schema } from "redis-om";
import { DatabaseChat } from "../types";

interface ChatEntity extends DatabaseChat {}
class ChatEntity extends Entity {}

export const chatSchema = new Schema(ChatEntity, {
  chat_id: { type: "string" },
  name: { type: "text" },
  last_message: { type: "string" },
  last_message_time: { type: "string" },
  created_at: { type: "number" },
  private: { type: "boolean" },
  members: { type: "string[]" },
  member_ids: { type: "string[]" },
  messages: { type: "string[]" },
  chat_owner_id: { type: "string" },
  chat_image: { type: "string" },
});
