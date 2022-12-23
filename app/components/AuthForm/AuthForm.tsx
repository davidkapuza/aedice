"use client";
import "./AuthForm.styles.css";
import { getProviders, signIn } from "next-auth/react";

type Props = {
  providers: Awaited<ReturnType<typeof getProviders>>;
};
function AuthForm({ providers }: Props) {
  return (
    <form className="AuthForm">
      <p>Sign up with:</p>
      <div>
        {Object.values(providers!).map((provider) => (
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
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}

export default AuthForm;
