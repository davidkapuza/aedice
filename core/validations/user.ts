import * as z from "zod";
import { ImageSchema, NameSchema, RolesSchema, UniqueIdSchema } from ".";

export const DatabaseUserSchema = z.object({
  name: NameSchema,
  image: ImageSchema,
  email: z.string().email(),
  role: RolesSchema
});

export const UserSchema = z
  .object({
    id: UniqueIdSchema,
  })
  .merge(DatabaseUserSchema);


