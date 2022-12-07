export const getUserChats = async (query: string) => {
  const res = await fetch(query);
  const { chats } = await res.json();
  return chats;
};
