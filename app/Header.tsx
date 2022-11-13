import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  const session = true;

  return (
    <header className="sticky top-0 z-40">
      {session ? (
        <>
          {/* <div>
            <Image
              className="rounded-full object-contain"
              height={10}
              width={50}
              src="https://avatars.dicebear.com/api/avataaars/JhonDoe.svg"
              alt="Profile Picture"
            />
            <p>Logged in as:</p>
            <p className="font-bold">Jhon Doe</p>
          </div> */}
          <Link href="/" className="font-bold">
            Sign out
          </Link>
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
