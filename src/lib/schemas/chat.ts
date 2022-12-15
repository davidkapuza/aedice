import { Entity, Schema } from "redis-om";
import * as z from "zod";

export const ChatZodSchema = z.object({
  id: z.string(),
  last_message: z.string().or(z.null()),
  last_message_time: z.number().or(z.null()),
  created_at: z.number(),
  private: z.boolean(),
  members: z.array(z.string()),
  members_id: z.array(z.string()),
  messages: z.array(z.string()),
  chat_owner: z.string(),
});

export type TypeChat = z.infer<typeof ChatZodSchema>;

interface Chat extends TypeChat {}
class Chat extends Entity {}

export const chatSchema = new Schema(Chat, {
  id: { type: "string" },
  last_message: { type: "string" },
  last_message_time: { type: "string" },
  created_at: { type: "number" },
  private: { type: "boolean" },
  members: { type: "string[]" },
  members_id: { type: "string[]" },
  messages: { type: "string[]" },
  chat_owner: { type: "string" },
});
