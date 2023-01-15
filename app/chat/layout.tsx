import ContactInfo from "@/core/ui/ContactInfo/ContactInfo";
import { Header, Sidebar } from "@/layouts/index";
import ChatBreakpoiont from "app/components/Breakpoints/ChatBreakpoiont";
import SidebarBreakpoint from "app/components/Breakpoints/SidebarBreakpoint";
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex px-4 md:px-[60px] pt-28 h-screen">
      {/* @ts-expect-error Server Component */}
      <Header />
      <SidebarBreakpoint>
        {/* @ts-expect-error Server Component */}
        <Sidebar />
      </SidebarBreakpoint>
      <ChatBreakpoiont>
        <main className="ChatLayout">{children}</main>
      </ChatBreakpoiont>
      <ContactInfo />
    </div>
  );
}
