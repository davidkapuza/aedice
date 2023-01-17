import "styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { Plus_Jakarta_Sans } from "@next/font/google";
import { Providers } from "./providers";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/core/auth";

const jakarta = Plus_Jakarta_Sans({variable: "--font-jakarta", weight: "500"})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(authOptions);
  return (
    <html className={`dark ${jakarta.variable}`}>
      <head />
      <body className="overflow-hidden dark:bg-black">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
