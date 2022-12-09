import Chat from "@/components/chat/Chat/Chat";
import { authOptions } from "@/lib/auth";
import { unstable_getServerSession } from "next-auth";

type ChatPageProps = {
  params: {
    chat_id: string;
  };
};

async function getMessages(chat_id: string) {
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

export default async function ChatPage({ params: { chat_id } }: ChatPageProps) {
  const session = await unstable_getServerSession(authOptions);
  const prerenderedMessages = await getMessages(chat_id)

  // if (!messages.length) return notFound()
  return (
    <Chat prerenderedMessages={prerenderedMessages} chat_id={chat_id} session={session} />
  );
}
