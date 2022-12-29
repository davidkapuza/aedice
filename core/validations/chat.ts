import * as z from "zod";
import { MessageSchema } from "./message";
import { ImageSchema, LastMessageSchema, NameSchema, UniqueIdSchema } from ".";
import { UserSchema } from "./user";

export const PublicChatSchema = z
  .object({
    chat_id: UniqueIdSchema,
    name: NameSchema,
    private: z.boolean(),
    member_ids: z.array(UniqueIdSchema),
    chat_image: ImageSchema,
  })
  .strict();

export const DatabaseChatSchema = PublicChatSchema.extend({
  chat_id: UniqueIdSchema.optional(),
  created_at: z.number(),
  members: z.array(z.string()),
  messages: z.array(z.string()),
  chat_owner_id: UniqueIdSchema,
})
  .merge(LastMessageSchema)
  .strict();

export const ChatSchema = DatabaseChatSchema.extend({
  chat_id: UniqueIdSchema,
  members: z.array(UserSchema),
}).omit({ messages: true });
