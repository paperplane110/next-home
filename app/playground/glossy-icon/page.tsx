"use client"
import { useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import OuterLink from "@/components/link";

export default function GlossyIcon() {
  const [showRounded, setShowRounded] = useState(true);
  const [showSquircle, setShowSquircle] = useState(true);

  return (
    <div className="page-top-margin sm:pb-8 section">
      <header className="subsection">
        <h1 className="headline font-serif font-light soft-70">Glossy Icon</h1>
        <p className="mt-8 text-sm font-medium text-muted-foreground">
          macOS Tahoe 风格的图标，带有边缘光泽、微立体的质感
        </p>
      </header>
      <div className="subsection mt-16">
        <h2 className="font-bold">iTerm2 Icon</h2>
        <div id="container" className="relative mt-8 h-100 w-full rounded-4xl flex items-center justify-center gap-x-4"
          style={{
            backgroundImage: "url('/img/gallery/tyler-casey-4uCdG0scCJ0-unsplash.jpg')",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300/20 backdrop-blur-sm w-[80%] h-24 rounded-3xl">
          </div>

          {/* flat icon */}
          <div id="iterm2" className="relative size-[57px]">
            <div
              className={cn(
                "w-[calc(100%+2px)] h-[calc(100%+2px)] -translate-x-px -translate-y-px",
                "bg-black icon-rounded-57"
              )}
            >
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black w-full h-full py-1 px-1.5 icon-rounded-57"
            >
              <div className="font-bold flex items-center gap-x-1">
                <div className="text-xl text-green-400 select-none">$</div>
                <div className="w-1 h-4 bg-linear-to-br from-green-600 to-green-800"></div>
              </div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-0.5 text-xs text-white">icon</div>
          </div>

          {/* glossy bg */}
          <div id="iterm2" className="relative size-[57px]">
            <div
              className={cn(
                "w-[calc(100%+2px)] h-[calc(100%+2px)] -translate-x-px -translate-y-px icon-rounded-57",
                "bg-linear-to-br from-gray-200 via-40% via-gray-900 to-gray-400"
              )}
            >
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-0.5 text-xs text-white">bg</div>
          </div>

          {/* glossy icon */}
          <div id="iterm2" className="relative size-[57px]">
            <div
              className={cn(
                "absolute size-[calc(100%+2px)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 icon-rounded-57",
                "bg-linear-to-br from-gray-200 via-40% via-gray-900 to-gray-400"
              )}
            >
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black w-full h-full icon-rounded-57 py-1 px-1.5">
              <div className="font-bold flex items-center gap-x-1">
                <div className="text-xl text-green-400 select-none">$</div>
                <div className="w-1 h-4 bg-linear-to-br from-green-600 to-green-800"></div>
              </div>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2.5 size-1 rounded-full bg-black"></div>
          </div>
        </div>
      </div>
      <div className="subsection mt-16">
        <h2 className="font-bold">Rounded Corner vs. Squircle Corner</h2>
        <p className="mt-4 text-muted-foreground">
          Apple 的图标边角使用的是
          <OuterLink
            className="underline"
            href="https://www.cocoanetics.com/2013/06/ios-7-icon-squircle/"
          >squircle 角</OuterLink>。
        </p>
        <p className="mt-4 text-muted-foreground">
          对比普通圆角，squircle 角的圆角更加平滑，在
          <OuterLink className="underline" href="https://hackernoon.com/apples-icons-have-that-shape-for-a-very-good-reason-720d4e7c8a14">曲率上是连续</OuterLink>
          的，不会在圆角和边之间出现曲率的突变，更符合 macOS 的风格。
        </p>
        <div
          id="container"
          className="relative mt-8 h-100 w-full border border-dashed border-gray-300 rounded-4xl flex flex-col items-center justify-center"
        >
          <div className="absolute h-px w-full bg-gray-300 top-1/2 -translate-y-1/2"></div>
          <div className="absolute w-px h-full bg-gray-300 left-1/2 -translate-x-1/2"></div>
          <div className={cn("relative size-57", showRounded && "border border-blue-500 rounded-[64px]")}>
            <div
              className={cn(
                "hidden absolute size-57 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary",
                showSquircle && "block"
              )}
              style={{ cornerShape: "squircle", borderRadius: "228px" } as CSSProperties}
            >
            </div>

            {/* Reference lines */}
            <div
              className={cn(
                "absolute size-[176px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "border border-gray-300 rounded-full"
              )}
            >
            </div>
            <div
              className={cn(
                "absolute size-[112px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "border border-gray-300 rounded-full"
              )}
            >
            </div>
          </div>
          <div className="absolute bottom-8 mt-4 flex items-center gap-x-4">
            <div className="flex items-center gap-x-2">
              <Switch className="data-[state=checked]:bg-blue-500" id="rounded" checked={showRounded} onClick={() => setShowRounded(!showRounded)} />
              <Label htmlFor="rounded">Rounded Corner</Label>
            </div>
            <div className="flex items-center gap-x-2">
              <Switch id="squircle" checked={showSquircle} onClick={() => setShowSquircle(!showSquircle)} />
              <Label htmlFor="squircle">Squircle Corner</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
