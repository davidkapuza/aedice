import "styles/globals.css"
import { unstable_getServerSession } from "next-auth";
import Providers from "./providers";
import { authOptions } from "src/pages/api/auth/[...nextauth]";

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
        <Providers session={session}>
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
