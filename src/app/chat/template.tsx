import { Footer } from "@/layouts/exports";
import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>{children}</div>
      <Footer />
    </>
  );
}
