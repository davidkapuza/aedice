import { headers } from "next/headers";

export async function getChats() {
  const responce = await fetch(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/chats`,
    {
      headers: { cookie: headers().get("cookie") } as { cookie: string },
    }
  );
  if (!responce?.ok) {
    console.log("Err...");
    return;
  }
  const { chats } = await responce.json();
  return chats;
}
