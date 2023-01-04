"use client";
import "./AuthForm.styles.css";
import { getProviders, signIn } from "next-auth/react";
import { Icons } from "@/core/ui/Icons/Icons";

type Props = {
  providers: Awaited<ReturnType<typeof getProviders>>;
};
function AuthForm({ providers }: Props) {
  return (
    <form className="AuthForm">
      <p>Sign up with:</p>
      <div>
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="ProviderButton"
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: `/chat`,
                  })
                }
              >
                {provider.name}
                {provider.name === "Google" && (
                  <Icons.google className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
      </div>
    </form>
  );
}

export default AuthForm;
