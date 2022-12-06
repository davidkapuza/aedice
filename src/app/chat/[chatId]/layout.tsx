import { authOptions } from "@api/auth/[...nextauth]";
import { ChatInput, Header } from "@components/index";
import { unstable_getServerSession } from "next-auth";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(authOptions);
  return (
    <>
      <Header />
      {children}
      <ChatInput session={session} />
    </>
  );
}
