"use client";
import { Icons } from "@/core/ui/Icons/Icons";
import { signIn } from "next-auth/react";
import "./AuthForm.styles.css";

function handleSignIn(e: React.MouseEvent<HTMLFormElement>) {
  e.preventDefault();
  signIn("google");
}

function AuthForm() {
  return (
    <form className="AuthForm" onSubmit={handleSignIn}>
      <p>Sign in with:</p>
      <div>
        <button className="ProviderButton" type="submit">
          Google
          <Icons.google className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

export default AuthForm;
