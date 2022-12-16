export async function getMessages(chat_id: string) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/chats/${chat_id}`
  );
  if (!response?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
  const { messages } = await response.json();
  return messages;
}