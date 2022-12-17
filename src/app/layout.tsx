import "styles/globals.css";
import { Space_Mono, Syne } from "@next/font/google";

const space_mono = Space_Mono({ variable: "--font-space_mono", weight: "400" });
const syne = Syne({ variable: "--font-syne"});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`dark ${space_mono.variable} ${syne.variable}`}>
      <head />
      <body className="dark:bg-black">{children}</body>
    </html>
  );
}
