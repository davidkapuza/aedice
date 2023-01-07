import { Entity, Schema } from "redis-om";
import { DatabaseChat } from "../types";

interface Chat extends DatabaseChat {}
class Chat extends Entity {}

export const chatSchema = new Schema(Chat, {
  name: { type: "text" },
  last_message: { type: "string" },
  created_at: { type: "number" },
  private: { type: "boolean" },
  members: { type: "string[]" },
  member_ids: { type: "string[]" },
  chat_owner_id: { type: "string" },
  chat_image: { type: "string" },
});
