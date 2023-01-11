import ContactInfo from "@/core/ui/ContactInfo/ContactInfo";
import { getCurrentUser } from "@/lib/session";
import { Header, Sidebar } from "@/layouts/index";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex px-[60px] pt-28 h-screen">
      {/* @ts-expect-error Server Component */}
      <Header />
      {/* @ts-expect-error Server Component */}
      <Sidebar />
      <main className="ChatLayout">{children}</main>
      <ContactInfo />
    </div>
  );
}
