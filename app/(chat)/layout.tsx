import Navbar from "../../common/components/layout/Navbar/Navbar";
import Sidebar from "../../common/components/layout/Sidebar/Sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <main className="w-full">{children}</main>
    </div>
  );
}
