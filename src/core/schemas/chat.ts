import { Entity, Schema } from "redis-om";
import * as z from "zod";
import { ChatEntity } from "../types/entities";

export const ChatZodSchema = z.object({
  name: z.string(),
  last_message: z.string().or(z.null()).optional(),
  last_message_time: z.number().or(z.null()).optional(),
  created_at: z.number().optional(),
  private: z.boolean(),
  members: z.array(z.string()),
  members_id: z.array(z.string()),
  messages: z.array(z.string()).optional(),
  chat_owner: z.string(),
});

interface Chat extends ChatEntity {}
class Chat extends Entity {}

export const chatSchema = new Schema(Chat, {
  name: { type: "text" },
  last_message: { type: "string" },
  last_message_time: { type: "string" },
  created_at: { type: "number" },
  private: { type: "boolean" },
  members: { type: "string[]" },
  members_id: { type: "string[]" },
  messages: { type: "string[]" },
  chat_owner: { type: "string" },
});
