import { User } from "next-auth";
import { v4 as uuid } from "uuid";
import Redis from "ioredis";

export async function initializeUserInDb(user: User) {
  const client = new Redis(process.env.REDIS_URL!, {
    enableAutoPipelining: true,
  });
  // ? Checking if user already exists
  const exists = await client.hexists("user:email:" + user.email, "uid");
  if (exists) {
    return true;
  }
  
  // ? Adding custom uid and chat id for user

  const uid = uuid();
  const chat_id = uuid();

  user.uid = uid;
  user.chat_id = chat_id;

  const userJson = JSON.stringify({ uid, chat_id, ...user });

  await client.hset("user:email:" + user.email, user)

  // ? Initialize chat for a new user
  await client.sadd("chat:members:" + chat_id, userJson);

  // ? Storing user email substrings in Redis sorted set for email autocomplete

  const sortedSet = [];
  const email = user.email!.toUpperCase();
  for (let i = 1; i < email.length; i++) {
    sortedSet.push(0);
    sortedSet.push(email.substring(0, i));
  }
  sortedSet.push(0);
  sortedSet.push(email + "*" + userJson + "*");
  await client.zadd("users:search", ...sortedSet);
  await client.quit()
  return true;
}
