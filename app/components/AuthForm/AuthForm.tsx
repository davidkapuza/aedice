"use client";
import { Icons } from "@/core/ui/Icons/Icons";
import { signIn } from "next-auth/react";
import "./AuthForm.styles.css";

function AuthForm() {
  return (
    <form className="AuthForm">
      <p>Sign up with:</p>
      <div>
        <button
          className="ProviderButton"
          onClick={() => signIn("google")}
        >
          Google
          <Icons.google className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

export default AuthForm;
