import "styles/globals.css";
import { Space_Mono } from '@next/font/google';

const font = Space_Mono({weight: "400", subsets: ['latin']})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`dark ${font.className}`}>
      <head/>
      <body className="dark:bg-black">{children}</body>
    </html>
  );
}
