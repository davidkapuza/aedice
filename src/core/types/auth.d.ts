import "next-auth";

declare module "next-auth" {
  interface User {
    uid: string;
  }

  interface Session {
    user: User;
  }
}