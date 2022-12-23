import type { Message } from "@/core/types";

export async function getMessages(query: string) {
  const response = await fetch(query);
  if (!response?.ok) {
    // TODO add err handling in ui
    console.log("Err...");
    return;
  }
  const { messages }: { messages: Message[] } = await response.json();
  return messages;
}

export async function sendMessage(
  chat_id: string,
  message: Message,
  messages: Message[]
) {
  const response = await fetch(`/api/chats/${chat_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  if (!response?.ok) {
    // TODO add err handling in ui
    console.log("Err...");
    return;
  }
  const data: { message: Message } = await response.json();
  return [...messages!, data.message];
}
