import ContactLinks from "@/core/ui/ContactLinks/ContactLinks";
import { Icons } from "@/core/ui/Icons/Icons";
import AuthForm from "./components/AuthForm/AuthForm";
import Image from "next/image";

async function HomePage() {
  return (
    <section className="flex items-center h-screen">
      <main className="flex flex-col gap-3 mb-20 ml-20">
        <p className="font-sans text-white">Hi 👋, Welcome to -</p>
        <Image
          width={350}
          height={150}
          priority
          className="my-4"
          src="/static/aedice.svg"
          alt="Aedice"
        />
        <p className="mb-3 font-sans text-white">
          Project is under construction... 🏗️
        </p>
        <ContactLinks
          links={[
            {
              href: "mailto:kapuzadavid@gmail.com",
              label: "Email",
              icon: <Icons.mail size={15} />,
            },
            {
              href: "https://t.me/dawidkapuza",
              label: "Telegram",
              icon: <Icons.telegram width={15} height={15} />,
            },
          ]}
        />
        <ContactLinks
          links={[
            {
              href: "https://github.com/davidkapuza/aedice",
              label: "GitHub",
              icon: <Icons.github size={15} />,
            },
          ]}
        />
      </main>
      <AuthForm/>
    </section>
  );
}

export default HomePage;
