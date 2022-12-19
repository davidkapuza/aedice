import { Header, Sidebar, Footer } from "app/layouts/exports";

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
      {children}
    </div>
  );
}
