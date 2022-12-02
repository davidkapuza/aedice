import { Chat } from "@components/index";

async function prerenderMessages() {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/getMessages`
  );
  return res.json();
}

export default async function ChatPage() {
  const { messages } = await prerenderMessages();
  return <Chat initialMessages={messages} />;
}
