"use client";
import { getProviders, signIn } from "next-auth/react";

type Props = {
  providers: Awaited<ReturnType<typeof getProviders>>;
};

function SignIn({ providers }: Props) {
  return (
    <div>
      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
              })
            }
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default SignIn;
