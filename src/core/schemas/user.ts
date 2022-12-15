import { Entity, Schema } from "redis-om";
import * as z from "zod";


export const UserZodSchema = z.object({
  id: z.string(),
  name: z.string().max(128),
  image: z.string().url(),
  email: z.string().email(),
  chat_id: z.string().or(z.null()),
});

export type TypeUser = z.infer<typeof UserZodSchema>;

interface User extends TypeUser {}
class User extends Entity {}

export const userSchema = new Schema(User, {
  id: { type: "string" },
  name: { type: "text" },
  image: { type: "string" },
  email: { type: "string" },
  chat_id: { type: "string" },
});
