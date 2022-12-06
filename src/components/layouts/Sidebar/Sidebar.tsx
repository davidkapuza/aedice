import { UsersSearch } from "@ui/index";
import "./Sidebar.styles.css";

// async function getUserChats(uid: string) {
//   const params = new URLSearchParams({ q: uid });
//   const res = await fetch(
//     `${
//       process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
//     }api/chat/getUserChats?` + params
//   );
//   const { chats }: { chats: string[] } = await res.json();
//   return chats.flat(1);
// }

export default async function Sidebar() {
  // const session = await unstable_getServerSession(authOptions);
  // const chats = await getUserChats(session?.user.uid!);
  return (
    <aside className="Sidebar">
      <UsersSearch />
      {/* <ul>{chats.map((chat: any) => {
        console.log(chat)
        return <div key={chat.chatId}>{chat.name}</div>
      }) }</ul> */}
    </aside>
  );
}
