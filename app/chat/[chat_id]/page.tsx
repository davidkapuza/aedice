import type { User } from "@/core/types";
import { getCurrentUser } from "@/lib/services/session";
import Chat from "app/chat/components/Chat/Chat";

type ChatPageProps = {
  params: {
    chat_id: string;
  };
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { chat_id } = params;
  const user = await getCurrentUser()
  return <Chat chat_id={chat_id} user={user} />;
}
