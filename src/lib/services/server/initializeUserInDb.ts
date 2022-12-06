import client from "@core/redis";
import { User } from "next-auth";
import { v4 as uuid } from "uuid";

export async function initializeUserInDb(user: User) {
  // * Checking if user already exists
  const exists = await client.get("user:email:" + user.email);
  if (exists) {
    await client.quit();
    return true;
  }

  const chat_id = uuid();
  const userId = uuid();
  const userJson = JSON.stringify({ uid: userId, chat_id, ...user });

  // * Adding custom id for user
  user.uid = userId;

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

  // * Initialize initial chat for a new user
  await client.hset("chat:members:" + chat_id, userId, userJson);

  // * Initialize set of chats user exists in
  await client.hset("user:chats:" + userId, chat_id, userJson);

  await client.quit();
  return true;
}


