export const searchUserByEmail = async (query: string) => {
  const res = await fetch(query);
  const { users } = await res.json();
  return users;
};
