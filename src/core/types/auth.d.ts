import "next-auth";

declare module "next-auth" {
  interface User {
    // chat_id?: string
  }

  interface Session {
    user: User;
  }
}