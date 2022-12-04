import { Chat } from "@components/index";
import getMessages from "@lib/services/chat/getMessages";
import { notFound } from "next/navigation";

export const dynamicParams = true;

type Props = {
  params: {
    chatId: string;
  };
};


export default async function ChatPage({ params: { chatId } }: Props) {
  const messages = await getMessages(chatId);
  // TODO add logic to define if chat is initialized or not
  // if (!messages.length) return notFound()
  return <Chat initialMessages={messages} chatId={chatId} />;
}

// ! BUG: generateStaticParams returns an error in dev mode

// async function getChats() {
//   const params = new URLSearchParams({
//     q: "5fe2a4ee-1de4-4e3a-a916-c5b8c300adf7",
//   });
//   const res = await fetch(
//     `${
//       process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
//     }api/chat/getChats?` + params
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
