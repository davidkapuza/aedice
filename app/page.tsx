import Link from "next/link";

async function HomePage() {
  return (
    <div className="text-white">
      <Link className="text-white" href={"/chat"}>Enter chat</Link>
    </div>
  );
}

export default HomePage;
