import { Header, Sidebar, Footer } from "@/layouts/exports";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Header />
      {/* @ts-expect-error Server Component */}
      <Sidebar />
      <main className="Chat-layout">{children}</main>
      <Footer />
    </div>
  );
}
