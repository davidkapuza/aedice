import { authOptions } from "server/services/auth";
import db, { chatsRepository } from "server/services/redis";
import { DatabaseChat, Message, PrivateChat, UniqueId } from "@/core/types";
import { getCurrentUser } from "@/lib/session";
import Chat from "app/chat/components/Chat/Chat";
import { redirect, notFound } from "next/navigation";

const getChatWithMessages = async (
  chat_id: UniqueId,
  user_id: UniqueId
): Promise<{ chat: PrivateChat; messages: Message[] } | undefined> => {
  try {
    const foundChat: DatabaseChat & { entityId: UniqueId } =
      await chatsRepository.fetch(chat_id);

    if (!foundChat || !foundChat?.member_ids?.includes(user_id)) return;

    const chat: PrivateChat = {
      chat_id: foundChat.entityId,
      name: foundChat.name,
      last_message: JSON.parse(foundChat.last_message),
      created_at: foundChat.created_at,
      access: foundChat.access,
      members: foundChat.members.map((member: string) => JSON.parse(member)),
      member_ids: foundChat.member_ids,
      chat_image: foundChat.chat_image,
      chat_owner_id: foundChat.chat_owner_id,
    };

    // TODO implement pagination
    const messagesJson: string[] = await db.execute([
      "ZRANGE",
      `Chat:Messages:${chat_id}`,
      0,
      100,
    ]);
    const messages: Message[] = messagesJson.map((message) =>
      JSON.parse(message)
    );

    return {
      chat,
      messages,
    };
  } catch (error) {
    console.log(error);
    return;
  }
};

type ChatPageProps = {
  params: {
    chat_id: string;
  };
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { chat_id } = params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions.pages!.signIn!);
  }

  const chatWithMessages = await getChatWithMessages(chat_id, user.id);
  if (!chatWithMessages?.chat) {
    notFound();
  }

  return (
    <Chat
      chat={chatWithMessages?.chat}
      messages={chatWithMessages.messages}
      user={user}
    />
  );
}
