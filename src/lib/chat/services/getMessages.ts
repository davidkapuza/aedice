import { Message } from "@core/types";

const url = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/";

const getMessages = async () => {
  const res = await fetch(`${url}/api/getMessages`);
  const data = await res.json();
  const messages: Message[] = data.messages;

  return messages;
};

export default getMessages;
