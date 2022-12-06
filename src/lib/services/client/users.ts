import { User } from "next-auth";

export const searchUserByEmail = async (query: string) => {
  const res = await fetch(query);
  const { users }: {users: User[]} = await res.json();
  return users;
};

