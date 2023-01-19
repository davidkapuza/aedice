import * as z from "zod";
import { ImageSchema, NameSchema, UniqueIdSchema } from ".";

export const DatabaseUserSchema = z.object({
  name: NameSchema,
  image: ImageSchema,
  email: z.string().email(),
  role: z.enum(["user", "admin"])
});

export const UserSchema = z
  .object({
    id: UniqueIdSchema,
  })
  .merge(DatabaseUserSchema);


