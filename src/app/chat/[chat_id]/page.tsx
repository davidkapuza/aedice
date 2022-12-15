import Chat from "src/app/chat/components/Chat/Chat";
import { getCurrentUser } from "@/lib/services/server/session";


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

export default async function ChatPage({ params }: ChatPageProps) {
  const { chat_id } = params;
  const user = await getCurrentUser();
  const prerenderedMessages = await getMessages(chat_id);

  // if (!messages.length) return notFound()
  return (
    <Chat
      prerenderedMessages={prerenderedMessages}
      chat_id={chat_id}
      user={user}
    />
  );
}
// ! Looking for a workaround for using generateStaticParams with session