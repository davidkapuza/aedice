import Redis from "ioredis";
import { User } from "next-auth";
import { v4 as uuid } from "uuid";

export default async function initializeUser(user: User) {
  const client = new Redis(process.env.REDIS_URL!, {
    enableAutoPipelining: true,
  });
  // * Checking if user already exists
  const exists = await client.get("user:email:" + user.email);
  if (exists) {
    await client.quit();
    return true;
  }

  const chatId = uuid();
  const userId = uuid();
  const userJson = JSON.stringify({ chatId, ...user });

  // * Adding custom id for user
  user.uid = userId;

  // * Storing user email substrings in Redis sorted set for search by email autocomplete
  // * Stored in format:
  /*
   * "EMAIL@DOMAIN.COM*
   * {\"name\":\"Jhon Doe\",
   * \"email\":\"jhondoe@domain.com\",
   * \"image\":\"https://example.com\",
   * \"emailVerified\":null,
   * \"id\":\"id\"}"
   * \"chatId\":\"chatId\"}*"
   * */

  const sortedSet = [];
  const email = user.email!.toUpperCase();
  for (let i = 1; i < email.length; i++) {
    sortedSet.push(0);
    sortedSet.push(email.substring(0, i));
  }
  sortedSet.push(0);
  sortedSet.push(email + "*" + userJson + "*");
  await client.zadd("users:all", ...sortedSet);

  // * Initialize initial chat for a new user
  await client.hset("chat:members:" + chatId, userId, userJson);

  // * Initialize set of chats user exists in
  await client.sadd("user:chats:" + userId, chatId);

  await client.quit();
  return true;
}
