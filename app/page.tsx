import AuthForm from "./components/AuthForm/AuthForm";
import Image from "next/image"

async function AuthPage() {
  return (
    <section className="flex items-center h-screen">
      <main className="flex flex-col gap-1 mb-20 ml-20">
        <p className="text-base text-white">Hi 👋, Welcome to -</p>
        <Image
          width={350}
          height={150}
          priority
          className="my-4"
          src="/static/aedice.svg"
          alt="Aedice"
        />
        <p className="mb-3 font-sans text-base text-white">
          Project is under construction... 🏗️👷
        </p>
      </main>
      <AuthForm />
    </section>
  );
}

export default AuthPage;
