import * as z from "zod"

export const MessageZodSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  text: z.string().min(1),
  username: z.string(),
  image: z.string().url(),
  sender_id: z.string(),
})


