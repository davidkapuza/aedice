import "next-auth";
declare module "next-auth" {
  interface User {
    id: string;
    image: string;
    name: string;
    email: string;
    role: "user" | "admin";
  }
  interface Session {
    user: User;
  }
}
