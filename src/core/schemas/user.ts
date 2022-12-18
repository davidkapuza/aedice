import { Entity, Schema } from "redis-om";
import * as z from "zod";
import { TypeUser } from "../types/entities";


export const UserZodSchema = z.object({
  name: z.string().max(128),
  image: z.string().url(),
  email: z.string().email(),
});

interface User extends TypeUser {}
class User extends Entity {}

export const userSchema = new Schema(User, {
  name: { type: "text" },
  image: { type: "string" },
  email: { type: "string" },
});
