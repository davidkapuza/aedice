"use client";
import { PusherProvider } from "@/lib/contexts/PusherContext";
import { ToastContainer } from "react-toastify";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
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
  );
}
