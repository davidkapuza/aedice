import AuthForm from "app/components/AuthForm/AuthForm";
import { getProviders } from "next-auth/react";
import React from "react";

async function LoginPage() {
  const providers = await getProviders();
  return (
    <div>
      <AuthForm providers={providers} />
    </div>
  );
}

export default LoginPage;
