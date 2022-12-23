import * as z from "zod";
import { DatabaseChatSchema, PublicChatSchema, ChatSchema } from "@/validations/chat";
import { DatabaseUserSchema, UserSchema } from "@/validations/user";
import { MessageSchema } from "@/validations/message";
import {
  UniqueIdSchema,
  LastMessageSchema,
  ImageSchema,
} from "@/validations/index";

export type DatabaseChat = z.infer<typeof DatabaseChatSchema>;
export type PublicChat = z.infer<typeof PublicChatSchema>;
export type Chat = z.infer<typeof ChatSchema>;

export type DatabaseUser = z.infer<typeof DatabaseUserSchema>;
export type User = z.infer<typeof UserSchema>;

export type Message = z.infer<typeof MessageSchema>;

export type UniqueId = z.infer<typeof UniqueIdSchema>;
export type LastMessage = z.infer<typeof LastMessageSchema>;
export type Image = z.infer<typeof ImageSchema>;
