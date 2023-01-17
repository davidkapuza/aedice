import { authOptions } from "@/core/auth";
import { chatsRepository } from "@/core/redis";
import { DatabaseChat, PrivateChat, UniqueId } from "@/core/types";
import { getCurrentUser } from "@/lib/session";
import ChatsList from "app/components/ChatsList/ChatsList";
import ChatsSearch from "app/components/ChatsSearch/ChatsSearch";
import { redirect } from "next/navigation";
import "./Sidebar.styles.css";

const getChats = async (user_id: UniqueId) => {
  try {
    const foundChats: Array<DatabaseChat & { entityId: UniqueId }> =
      await chatsRepository
        .search()
        .where("member_ids")
        .contain(user_id)
        .return.all();

    const chats: PrivateChat[] = foundChats
      .map((chat) => ({
        chat_id: chat.entityId,
        name: chat.name,
        last_message: JSON.parse(chat.last_message),
        created_at: chat.created_at,
        access: chat.access as "public" | "private",
        members: chat.members.map((member: string) => JSON.parse(member)),
        member_ids: chat.member_ids,
        chat_image: chat.chat_image,
        chat_owner_id: chat.chat_owner_id,
      }))
      .sort(
        (a, b) =>
          a.members.find((member) => member.id === user_id)?.joined_at -
          b.members.find((member) => member.id === user_id)?.joined_at
      );

    return chats;
  } catch (error) {
    console.error(error);
    return;
  }
};

export default async function Sidebar() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions.pages!.signIn!);
  }
  const chats: PrivateChat[] | undefined = await getChats(user.id);
  return (
    <aside className="Sidebar">
      <ChatsSearch user={user}>
        <ChatsList user={user} chats={chats} />
      </ChatsSearch>
    </aside>
  );
}
