import { TMessage } from "@core/types/entities";

const getMessages = async (chatId: string) => {
  const params = new URLSearchParams({ q: chatId });
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }api/chat/getMessages?` + params
  );
  const { messages }: { messages: TMessage[] } = await res.json();
  return messages;
};

export default getMessages;
