import { Header, Sidebar } from "@/components/index";
import Footer from "@/components/layouts/Footer/Footer";

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
