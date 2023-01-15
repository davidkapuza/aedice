import * as z from "zod";
import {
  DatabaseChatSchema,
  PublicChatSchema,
  PrivateChatSchema,
} from "@/validations/chat";
import { DatabaseUserSchema, UserSchema } from "@/validations/user";
import { MessageSchema } from "@/validations/message";
import { UniqueIdSchema, ImageSchema } from "@/validations/index";

export type DatabaseChat = z.infer<typeof DatabaseChatSchema>;
export type PublicChat = z.infer<typeof PublicChatSchema>;
export type PrivateChat = z.infer<typeof PrivateChatSchema>;

export type DatabaseUser = z.infer<typeof DatabaseUserSchema>;
export type User = z.infer<typeof UserSchema>;

export type Message = z.infer<typeof MessageSchema>;

export type UniqueId = z.infer<typeof UniqueIdSchema>;
export type Image = z.infer<typeof ImageSchema>;

export type RequestWithUser = NextApiRequest & {
  user: User;
};
