export const getUserChats = async (query: string) => {
  console.log("GETUSERCHATS FETCH WITH >> ", query)
  const res = await fetch(query);
  const { chats } = await res.json();
  return chats;
};
