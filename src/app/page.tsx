import { getCurrentUser } from "@/lib/session";

async function HomePage() {
  const user = await getCurrentUser();

  return <div className="text-white">Welcome {user?.name}</div>;
}

export default HomePage;
