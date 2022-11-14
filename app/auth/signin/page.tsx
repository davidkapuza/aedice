import { getProviders, signIn } from "next-auth/react";
import SignIn from "./SignIn"

async function Auth() {
  const providers = await getProviders()

  return <>
    <div>SignIn</div>
    <SignIn providers={providers}/>
  </>;
}

export default Auth;
