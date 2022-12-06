import { TMessage } from "@core/types/entities";

export const getMessagesById = async (query: string) => {
  const res = await fetch(query);
  const { messages }: { messages: TMessage[] } = await res.json();
  return messages;
};
