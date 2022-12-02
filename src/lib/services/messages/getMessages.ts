import { Message } from "@core/types";

const getMessages = async () => {
  const res = await fetch(`/api/getMessages`);
  const data = await res.json();
  const messages: Message[] = data.messages;

  return messages;
};

export default getMessages;
