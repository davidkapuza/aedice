import * as z from "zod";

export const UniqueIdSchema = z.string().length(26);

export const MessageTextSchema = z.string().min(1).max(320);

export const NameSchema = z.string().min(6).max(30);

export const LastMessageSchema = z.object({
  last_message: MessageTextSchema.default("You have no messages yet."),
  last_message_time: z.number().nullish(),
});

export const ImageSchema = z.string().url();

export const QuerySchema = z.string().min(2).max(30);
