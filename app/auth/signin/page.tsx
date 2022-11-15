import { getProviders, signIn } from "next-auth/react";
import SignIn from "./SignIn"

async function SignInPage() {
  const providers = await getProviders()

  return <>
    <SignIn providers={providers}/>
  </>;
}

export default SignInPage;
