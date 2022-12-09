import "next-auth";

declare module "next-auth" {
  interface User {
    uid?: string;
    chat_id?: string
  }

  interface Session {
    user: User;
  }
}