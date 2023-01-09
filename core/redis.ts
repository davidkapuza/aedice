import { Client } from "redis-om";
import { chatSchema } from "./schemas/chat";
import { userSchema } from "./schemas/user";


const client = new Client();

export async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
  return client;
}

const registerService = async (name: string, initFn: () => Promise<Client>) => {
  if (process.env.NODE_ENV === "development" && name === "__redisClient") {
    if (!(name in globalThis)) {
      globalThis[name] = await initFn();
    }
    return globalThis[name];
  }
  return await initFn();
};

const db = await registerService("__redisClient", connect);
export const usersRepository = db.fetchRepository(userSchema);
// const usesIdx = await usersRepository.createIndex()
export const chatsRepository = db.fetchRepository(chatSchema);
// const chatIdx = await chatsRepository.createIndex()

export default db;
