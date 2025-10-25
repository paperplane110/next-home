"use client";

import { createContext, useContext, useState } from "react";

type FrameContextType = {
  isShowFrame: boolean;
  toggleFrame: () => void;
};

const FrameContext = createContext<FrameContextType | undefined>(undefined);

export function FrameProvider({ children }: { children: React.ReactNode }) {
  const [isShowFrame, setIsShowFrame] = useState(false);

  const toggleFrame = () => {
    setIsShowFrame((prev) => !prev);
  };

  return (
    <FrameContext.Provider value={{ isShowFrame, toggleFrame }}>
      {children}
    </FrameContext.Provider>
  );
}

export function useFrame() {
  const context = useContext(FrameContext);
  if (context === undefined) {
    throw new Error("useFrame must be used within a FrameProvider");
  }
  return context;
}