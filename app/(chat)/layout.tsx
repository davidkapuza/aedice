import Sidebar from "../../common/components/Navigation";
import ProfilesBar from "../../common/components/Sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <ProfilesBar />
      <main className="w-full">{children}</main>
    </div>
  );
}
