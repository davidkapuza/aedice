import { authOptions } from "@api/auth/[...nextauth]";
import { Chat } from "@components/index";
import { getMessagesById } from "@services/client/messages";
import { unstable_getServerSession } from "next-auth";

type Props = {
  params: {
    chat_id: string;
  };
};

export default async function ChatPage({ params: { chat_id } }: Props) {
  console.log(chat_id)
  const sessionData = unstable_getServerSession(authOptions)
  const messagesData = getMessagesById(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/messages/getMessagesById?q=` + chat_id
  );
  // TODO add logic to define if chat is initialized or not
  const [session, messages] = await Promise.all([sessionData, messagesData])
  // if (!messages.length) return notFound()
  return (
    <Chat initialMessages={messages} chat_id={chat_id} session={session} />
  );
}

// ! BUG: generateStaticParams returns an error in dev mode

// async function getAllChats() {
//   const params = new URLSearchParams({
//     q: "5fe2a4ee-1de4-4e3a-a916-c5b8c300adf7",
//   });
//   const res = await fetch(
//     `${
//       process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
//     }api/chat/getAllChats?` + params
//   );

//   const chats = res.json();
//   return chats;
// }

// export async function generateStaticParams() {
//   const { chats }: { chats: string[] } = await getChats();

//   return chats.map((chat: string) => ({
//     chatId: chat,
//   }));
// }
