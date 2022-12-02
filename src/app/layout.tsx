import { authOptions } from "@api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import "styles/globals.css";
import Providers from "./providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(authOptions);
  return (
    <html>
      <head />
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
