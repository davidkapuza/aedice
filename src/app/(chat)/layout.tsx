import Navbar from "@components/layouts/Navbar/Navbar";
import Sidebar from "@components/layouts/Sidebar/Sidebar"

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
