"use client";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { usePathname } from "next/navigation";

function SidebarBreakpoint({ children, breakpoint }: { children: React.ReactNode, breakpoint?: string }) {
  const pathname = usePathname()
  const isBreakpoint = useMediaQuery(breakpoint);
  return <>{(pathname === "/chat" || !isBreakpoint) && children}</>;
}

export default SidebarBreakpoint;
