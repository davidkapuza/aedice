import ContactInfo from "@/core/ui/ContactInfo/ContactInfo";
import ChatBreakpoiont from "app/components/Breakpoints/ChatBreakpoiont";
import SidebarBreakpoint from "app/components/Breakpoints/SidebarBreakpoint";
import Header from "app/components/Header/Header";
import Sidebar from "app/components/Sidebar/Sidebar";
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
