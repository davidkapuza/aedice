"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { PusherProvider } from "@/lib/contexts/PusherContext";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

type Props = {
  session: Session | null;
  children: React.ReactNode;
};

export function Providers({ session, children }: Props) {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <PusherProvider>{children}</PusherProvider>
    </>
    // <SessionProvider session={session}>
    // </SessionProvider>
  );
}
