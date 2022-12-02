import { ChatInput, Header } from "@components/index";


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <ChatInput />
    </>
  );
}
