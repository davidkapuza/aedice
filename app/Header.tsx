import { unstable_getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SignOutBtn from "../components/SignOutBtn";

async function Header() {
  const session = await unstable_getServerSession()

  return (
    <header className="sticky top-0 z-40">
      {session ? (
        <>
          <p>Logged in as:</p>
          <p>{session.user?.email}</p>
        <SignOutBtn />
        </>
      ) : (
        <Link href="/auth/signin" className="font-bold">
          Sign in
        </Link>
      )}
    </header>
  );
}

export default Header;
