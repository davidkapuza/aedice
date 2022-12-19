import { User } from "next-auth";

export async function getChats() {
  const response = await fetch(`/api/chats`);
  if (!response?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
  const { chats } = await response.json();
  return chats;
}

export async function searchChats(query: string) {
  const response = await fetch(query);
  if (!response?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
  const { chats } = await response.json();
  return chats;
}

export async function joinChat(chat_id: string, user: User) {
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

export async function quitChat(chat_id: string) {
  const response = await fetch(`/api/chats/${chat_id}`, { method: "DELETE" });
  if (!response?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
  return true;
}
