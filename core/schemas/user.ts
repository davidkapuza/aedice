import { Entity, Schema } from "redis-om";
import { DatabaseUser } from "../types";

interface User extends DatabaseUser {}
class User extends Entity {}

export const userSchema = new Schema(User, {
  name: { type: "text" },
  image: { type: "string" },
  email: { type: "string" },
});
