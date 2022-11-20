import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import SignOutBtn from "./SignOutBtn";
async function Header() {

  return (
    
    <header className="sticky top-0 z-40">
      {/* {session ? (
        <>
          <p>Logged in as:</p>
          <p>{session.user?.email}</p>
          <SignOutBtn />
        </>
      ) : (
        <Link href="/auth/signin" className="font-bold">
          Sign in
        </Link>
      )} */}
    </header>
  );
}

export default Header;
