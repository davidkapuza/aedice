import Redis from "ioredis";
import { User } from "next-auth";
import { v4 as uuid } from "uuid";

export async function initializeUserInDb(user: User) {
  const client = new Redis(process.env.REDIS_URL!, {
    enableAutoPipelining: true,
  });
  // * Checking if user already exists
  const exists = await client.get("user:email:" + user.email);
  if (exists) {
    return true;
  }

  const chat_id = uuid();
  const user_id = uuid();
  const userJson = JSON.stringify({ uid: user_id, chat_id, ...user });

  // * Adding custom uid and chat id for user
  user.uid = user_id;
  user.chat_id = chat_id;

  // * Storing user email substrings in Redis sorted set for search by email autocomplete

  const sortedSet = [];
  const email = user.email!.toUpperCase();
  for (let i = 1; i < email.length; i++) {
    sortedSet.push(0);
    sortedSet.push(email.substring(0, i));
  }
  sortedSet.push(0);
  sortedSet.push(email + "*" + userJson + "*");
  await client.zadd("users:all", ...sortedSet);

  await client.quit();
  return true;
}
