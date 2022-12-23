import * as z from "zod";
import { ImageSchema, NameSchema, UniqueIdSchema } from ".";

export const DatabaseUserSchema = z
  .object({
    name: NameSchema,
    image: ImageSchema,
    email: z.string().email(),
  })
  .strict();

export const UserSchema = z
  .object({
    id: UniqueIdSchema,
  })
  .merge(DatabaseUserSchema);
