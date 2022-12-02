import { Navbar, Sidebar } from "@components/index";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Navbar />
      <Sidebar />
      <main className="Chat-layout">{children}</main>
    </div>
  );
}
