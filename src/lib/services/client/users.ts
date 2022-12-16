export async function searchUsers(query: string) {
  const response = await fetch(query);
  if (!response?.ok) {
    console.log("Err..");
    return;
  }
  const { users } = await response.json();
  return users;
}