import { TypeUser } from "@/core/schemas/user";

export async function joinChat(chat_id: string, user: TypeUser) {
  const response = await fetch(`/api/chats/${chat_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  });
  if (!response?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
}

export async function getChats() {
  const response = await fetch("/api/chats");
  if (!response?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
  const { chats } = await response.json();
  return chats;
}

export async function quitChat(chat_id: string) {
  const response = await fetch(`/api/chats/${chat_id}`, { method: "DELETE" });
  if (!response?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
  return true;
}
