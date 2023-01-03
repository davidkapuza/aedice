import React, { createContext } from "react";
import usePusherContext from "../hooks/pusher/usePusherContext";

type PusherContextType = ReturnType<typeof usePusherContext>;

const PusherContext = createContext<PusherContextType | null>(null);

function PusherProvider({ children }: { children: React.ReactNode }) {
  return (
    <PusherContext.Provider value={usePusherContext()}>
      {children}
    </PusherContext.Provider>
  );
}

export { PusherProvider, PusherContext };
