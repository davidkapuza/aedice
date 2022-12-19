import Chat from "app/chat/components/Chat/Chat";
import { getCurrentUser } from "@/lib/services/server/session";
import { getMessages } from "@/lib/services/server/messages";

type ChatPageProps = {
  params: {
    chat_id: string;
  };
};

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
