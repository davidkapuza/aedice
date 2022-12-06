import { User } from "next-auth"

export type TMessage = {
  id: string,
  message: string,
  created_at: number,
  username: string,
  image: string,
  email: string,
}
