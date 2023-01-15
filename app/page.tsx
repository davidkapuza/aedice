import Glow from "@/core/ui/Glow/Glow";
import AuthForm from "./components/AuthForm/AuthForm";

async function AuthPage() {
  return (
    <section className="flex items-center h-screen">
      <main className="flex flex-col gap-1 mx-10 text-white md:mx-20">
        <p className="text-base text-white">Hi 👋, Welcome to Aedice</p>
        <p className="text-base text-white">{"[Description...]"}</p>
        <p className="mb-3 font-sans text-base text-white">
          Project currently is under construction... 🏗️👷
        </p>
        <div className="mt-14">
          <Glow border="rounded-full" className="px-3 py-1">
            <AuthForm />
          </Glow>
        </div>
      </main>
    </section>
  );
}

export default AuthPage;
