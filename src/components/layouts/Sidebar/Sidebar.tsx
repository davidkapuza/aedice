import { authOptions } from "@api/auth/[...nextauth]";
import EnterChatButton from "@core/ui/EnterChatButton/EnterChatButton";
import { getUserChats } from "@lib/services/client/chats";
import { UsersSearch } from "@ui/index";
import { unstable_getServerSession } from "next-auth";
import "./Sidebar.styles.css";

export default async function Sidebar() {
  const session = await unstable_getServerSession(authOptions);
  const chats = await getUserChats(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/chats/getUserChats?q=` + session?.user.uid!
  );

  return (
    <aside className="Sidebar">
      <UsersSearch />
      <ul>
        {chats.map(({ members, chat_id }: any) => {
          const chatOwner = members.filter(
            (member: any) => member.uid !== session?.user.uid
          )[0];
          return (
            <EnterChatButton key={chat_id} user={chatOwner} chat_id={chat_id} />
          );
        })}
      </ul>
    </aside>
  );
}
