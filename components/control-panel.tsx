"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FrameSwitch } from "./frame-switch";
import { HomeIcon, Italic } from "lucide-react";

export default function ControlPanel() {
  const pathname = usePathname()
  return (
    <div className="fixed top-4 right-4 z-1000 border p-2 flex gap-2">
      <FrameSwitch />
      <Link
        className={cn(
          "p-1 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:ring-2 hover:ring-gray-300",
          pathname === "/playground/fonts" ? "ring-2 ring-muted-foreground/50 hover:ring-muted-foreground" : ""
        )}
        href="/playground/fonts">
          <Italic className="w-4 h-4" />
      </Link>
      <Link
        className={cn(
          "p-1 rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:ring-2 hover:ring-gray-300",
          pathname === "/" ? "ring-2 ring-muted-foreground/50 hover:ring-muted-foreground" : ""
        )}
        href="/">
          <HomeIcon className="w-4 h-4" />
      </Link>
    </div>
  )
}