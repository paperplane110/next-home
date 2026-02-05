"use client";

import { createContext, useContext, useState } from "react";

type FrameContextType = {
  isShowFrame: boolean;
  toggleFrame: () => void;
  enableFrame: () => void;
};

const FrameContext = createContext<FrameContextType | undefined>(undefined);

export function FrameProvider({ children }: { children: React.ReactNode }) {
  const [isShowFrame, setIsShowFrame] = useState(false);

  const toggleFrame = () => {
    setIsShowFrame((prev) => !prev);
  };

  const enableFrame = () => {
    setIsShowFrame(true)
  }

  return (
    <FrameContext.Provider value={{ isShowFrame, toggleFrame, enableFrame }}>
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