import ChatsList from "@/core/ui/ChatsList/ChatsList";
import UsersSearch from "@/core/ui/UsersSearch/UsersSearch";
import { authOptions } from "@/lib/auth";
import { unstable_getServerSession } from "next-auth";
import "./Sidebar.styles.css";

async function getChats() {
  const responce = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"}api/chats`
  );
  if (!responce?.ok) {
    // TODO handle errors with ui
    console.log("Err...");
    return;
  }
  const { chats } = await responce.json();
  return chats;
}

export default async function Sidebar() {
  const session = await unstable_getServerSession(authOptions);
  const prerenderedChats = await getChats();

  return (
    <aside className="Sidebar">
      <UsersSearch />
      <ChatsList prerenderedChats={prerenderedChats} session={session} />
    </aside>
  );
}
