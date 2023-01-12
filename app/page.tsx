import AuthForm from "./components/AuthForm/AuthForm";
import Image from "next/image";
import Glow from "@/core/ui/Glow/Glow";

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
      <div className="absolute -translate-x-1/2 left-1/2 bottom-24">
        <Glow border="rounded-full" className="px-3 py-1">
          <AuthForm />
        </Glow>
      </div>
    </section>
  );
}

export default AuthPage;
