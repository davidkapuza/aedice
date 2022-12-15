import { TypeUser } from "@/lib/schemas/user";


export async function joinChat(chat_id: string, user: TypeUser) {
  const responce = await fetch(`/api/chats/${chat_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  });
  if (!responce?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
}

export async function getChats() {
  const responce = await fetch("/api/chats");
  if (!responce?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
  const { chats } = await responce.json();
  return chats;
}
