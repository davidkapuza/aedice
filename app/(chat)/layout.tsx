import Sidebar from "../../common/components/Sidebar";
import ProfilesBar from "../../common/components/ProfilesBar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <ProfilesBar />
      <main className="chat-container">{children}</main>
    </div>
  );
}
