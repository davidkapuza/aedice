import { authOptions } from "@api/auth/[...nextauth]";
import ChatsList from "@core/ui/ChatsList/ChatsList";
import UsersSearch from "@core/ui/UsersSearch/UsersSearch";

import { getUserChats } from "@lib/services/client/chats";

import { unstable_getServerSession } from "next-auth";
import "./Sidebar.styles.css";

export default async function Sidebar() {
  const session = await unstable_getServerSession(authOptions);
  const prerenderedChats = await getUserChats(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/chats/getUserChats?q=` + session?.user.uid!
  );

  return (
    <aside className="Sidebar">
      <UsersSearch />
      <ChatsList prerenderedChats={prerenderedChats} session={session} />
    </aside>
  );
}
