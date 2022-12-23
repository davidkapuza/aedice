import "next-auth";
import "@/validations/index";
declare module "next-auth" {
  interface User {
    id: UniqueId;
    image: Image;
  }
  interface Session {
    user: User;
  }
}
