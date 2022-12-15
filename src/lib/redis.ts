import { Client } from "redis-om";

const client = new Client();
const url = process.env.REDIS_URL;

export async function connect() {
  console.log("CONNECTION IS OPEN >> ", client.isOpen());
  if (!client.isOpen()) {
    await client.open(url);
  }
}

export default client;
