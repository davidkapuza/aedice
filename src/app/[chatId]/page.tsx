import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@api/auth/[...nextauth]";
import MessageInput from "@components/chat/MessageInput";
import MessagesList from "@components/chat/MessagesList";
import Header from "@components/layouts/Header/Header";

async function prerenderMessages() {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/getMessages`
  );
  return res.json();
}

async function ChatPage() {
  const messagesData = prerenderMessages();
  const sessionData = unstable_getServerSession(authOptions);

  const [{ messages }, session] = await Promise.all([
    messagesData,
    sessionData,
  ]);

  return (
    <div className="chat-container">
      <Header />
      <MessagesList initialMessages={messages} />
      <MessageInput session={session} />
    </div>
  );
}

export default ChatPage;
