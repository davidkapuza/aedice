import { Header, Sidebar, Footer } from "@/layouts/exports";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* @ts-expect-error Server Component */}
      <Header />
      {/* @ts-expect-error Server Component */}
      <Sidebar />
      <main className="Chat-layout">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
