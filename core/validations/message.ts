import * as z from "zod";
import { ImageSchema, MessageTextSchema, NameSchema, UniqueIdSchema } from ".";

export const MessageSchema = z.object({
  id: z.string().uuid(),
  created_at: z.number(),
  text: MessageTextSchema,
  username: NameSchema,
  image: ImageSchema,
  sender_id: UniqueIdSchema,
});


