import * as z from "zod";
import { ImageSchema, NameSchema, UniqueIdSchema } from ".";

export const DatabaseUserSchema = z
  .object({
    name: NameSchema.optional(),
    image: ImageSchema.optional(),
    email: z.string().email(),
  })

export const UserSchema = z
  .object({
    id: UniqueIdSchema,
  })
  .merge(DatabaseUserSchema);
