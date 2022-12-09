import { authOptions } from "@api/auth/[...nextauth]";
import { Chat, ChatInput } from "@components/index";
import { getUserChats } from "@lib/services/client/chats";
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
  // if (!messages.length) return notFound()
  return (
    <Chat initialMessages={messages} chat_id={chat_id} session={session} />
  );
}

// ! Can't get session in generateStaticParams

// export async function generateStaticParams() {
//   const chats = await getUserChats(
//     `${
//       process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
//     }api/chats/getUserChats`
//   );

//   return chats?.map((chat: string) => ({
//     chatId: chat,
//   }));
// }
