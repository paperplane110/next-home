"use client";
import { cn } from "@/lib/utils";
import { FrameIcon } from "lucide-react";
import { useFrame } from "./frame-context";

export function FrameSwitch() {
  const { isShowFrame, toggleFrame } = useFrame();

  return (
    <button
      onClick={toggleFrame}
      className={cn(
        "p-1 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:ring-2 hover:ring-gray-300",
        isShowFrame ? "ring-2 ring-muted-foreground/50 hover:ring-muted-foreground" : ""
      )}
    >
      <FrameIcon className="w-4 h-4" />
    </button>
  );
}