import AuthForm from "app/components/AuthForm/AuthForm";
import { getProviders } from "next-auth/react";
import React from "react";
import parseProviders from "next-auth/core/lib/providers"
import Loader from "@/core/ui/Loader/Loader";
async function LoginPage() {
  // ! BUG fetch to /api/auth/providers fails at build time.
  const providers = await getProviders();

  return (
    <main>
      <div className="absolute pl-8 bottom-1/2">
        <h1 className="font-sans text-[6rem] font-bold text-white leading-[7rem]">
          Aedice.
        </h1>
        <p className="max-w-md text-[10px] text-gray-400">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi
          nisi quas, cumque at, tenetur iusto sapiente alias a recusandae
          consectetur reiciendis accusantium.
        </p>
      </div>
      <AuthForm providers={providers} />
    </main>
  );
}

export default LoginPage;
