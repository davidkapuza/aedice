import * as z from "zod"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().max(128),
  image: z.string().url(),
  email: z.string().email(),
  chat_id: z.string()
})

export type TypeUser = z.infer<typeof UserSchema>