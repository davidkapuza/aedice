import { Plus_Jakarta_Sans } from "@next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "styles/globals.css";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  weight: "500",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`dark ${jakarta.variable}`}>
      <head />
      <body className="overflow-hidden dark:bg-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
