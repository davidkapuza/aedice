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
  const sessionData = unstable_getServerSession(authOptions);
  const messagesData = getMessagesById(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/messages/getMessagesById?q=` + chat_id
  );
  const [session, messages] = await Promise.all([sessionData, messagesData]);
  // TODO add logic to define if chat is initialized or not
  // if (!messages.length) return notFound()
  return (
    <Chat initialMessages={messages} chat_id={chat_id} session={session} />
  );
}

// ! BUG: generateStaticParams returns an error in dev mode

// async function getUserChats() {
//   const res = await fetch(
//     `${
//       process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
//     }api/chats/getUserChats`,
//     {
//       next: { revalidate: 10 },
//     }
//   );

//   const { chats } = await res.json();
//   return chats;
// }

// export async function generateStaticParams() {
//   const { chats }: { chats: string[] } = await getUserChats();

//   return chats?.map((chat: string) => ({
//     chatId: chat,
//   }));
// }
