import * as z from "zod"

export const MessageSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  text: z.string().min(1),
  username: z.string().min(3).max(128),
  image: z.string().url(),
  email: z.string().email(),
})

export type TypeMessage = z.infer<typeof MessageSchema>
