import { Entity, Schema } from "redis-om";
import { DatabaseUser } from "../types";

interface UserEntity extends DatabaseUser {}
class UserEntity extends Entity {}

export const userSchema = new Schema(UserEntity, {
  name: { type: "text" },
  image: { type: "string" },
  email: { type: "string" },
});
