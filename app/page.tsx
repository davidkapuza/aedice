import Link from "next/link";
import SecondTest from "./components/SecondTest";
import TestComponent from "./components/TestComponent";

async function HomePage() {
  return (
    <div className="text-white">
      <Link className="text-white" href={"/chat"}>
        Enter chat
      </Link>
      <TestComponent />
      <SecondTest />
    </div>
  );
}

export default HomePage;
