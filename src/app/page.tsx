import { getCurrentUser } from "@/lib/services/server/session";


async function HomePage() {
  const user = await getCurrentUser();

  return <div className="text-white">Welcome {user?.name}</div>;
}

export default HomePage;
