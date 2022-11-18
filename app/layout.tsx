import "../common/styles/globals.css"
import { unstable_getServerSession } from "next-auth";
import Providers from "./providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession();
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
