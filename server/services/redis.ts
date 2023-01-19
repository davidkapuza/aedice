import { Client } from "redis-om";
import { chatSchema } from "@/schemas/chat";
import { userSchema } from "@/schemas/user";

type Services = "__redisClient"
const client = new Client();

export async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
  return client;
}

const registerService = async (name: Services, initFn: () => Promise<Client>) => {
  if (process.env.NODE_ENV === "development") {
    if (!(name in globalThis)) {
      globalThis[name] = await initFn();
    }
    return globalThis[name];
  }
  return await initFn();
};

const db = await registerService("__redisClient", connect);
export const usersRepository = db.fetchRepository(userSchema);
export const chatsRepository = db.fetchRepository(chatSchema);

export default db;