"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { PusherProvider } from "@/lib/contexts/PusherContext";

type Props = {
  session: Session | null;
  children: React.ReactNode;
};

export function Providers({ session, children }: Props) {
  return (
    // <SessionProvider session={session}>
      <PusherProvider>
        {children}
      </PusherProvider>
    // </SessionProvider>
  );
}
