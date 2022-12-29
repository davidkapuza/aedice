import "styles/globals.css";
import { Space_Mono, Syne } from "@next/font/google";
import { Providers } from "./providers";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/core/auth";

const space_mono = Space_Mono({ variable: "--font-space_mono", weight: "400" });
const syne = Syne({ variable: "--font-syne" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(authOptions);
  return (
    <html className={`dark ${space_mono.variable} ${syne.variable}`}>
      <head />
      <body className="dark:bg-black">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
