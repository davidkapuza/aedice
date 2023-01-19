import * as z from "zod";
import { ImageSchema, NameSchema, ChatRolesSchema, UniqueIdSchema } from ".";
import { MessageSchema } from "./message";
import { UserSchema } from "./user";

export const ChatMemberSchema = UserSchema.extend({
  joined_at: z.number(),
  chat_role: ChatRolesSchema,
});

export const PublicChatSchema = z
  .object({
    chat_id: UniqueIdSchema,
    name: NameSchema,
    access: z.enum(["public", "private"]).default("public"),
    member_ids: z.array(UniqueIdSchema),
    chat_image: ImageSchema,
  })
  .strict();

export const DatabaseChatSchema = PublicChatSchema.extend({
  created_at: z.number(),
  members: z.array(z.string()),
  last_message: z.string(),
  chat_owner_id: UniqueIdSchema,
})
  .omit({ chat_id: true })
  .strict();

export const PrivateChatSchema = DatabaseChatSchema.extend({
  chat_id: UniqueIdSchema,
  members: z.array(ChatMemberSchema),
  last_message: MessageSchema,
});
