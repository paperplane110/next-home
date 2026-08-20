"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useState, useEffect } from "react";

import { OdysseySidebar } from "@/components/odyssey/odyssey-sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fraunces } from "@/lib/fonts";
import { HelperCommand } from "@/components/helper-command";

export default function TheOdysseyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">

      {/* Navigator Header */}
      <header
        className={cn(
          "sticky top-0 z-40 shrink-0 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md",
          "transition-opacity",
          !isMounted && "opacity-0"
        )}
      >
        <div className="w-full mx-auto px-6">
          <div className="h-16 flex items-center gap-4 w-full">
            <Link
              href="/the-odyssey"
              className="flex items-center gap-2 shrink-0 group"
            >
              <div className="flex flex-col leading-tight">
                <span
                  className={cn(
                    "text-base font-semibold tracking-tight",
                    fraunces.className
                  )}
                >
                  The Odyssey Walkthrough
                </span>
                <span className="text-[11px] text-neutral-500 -mt-0.5">
                  Tianyu&apos;s Reading Notes
                </span>
              </div>
            </Link>

            <div className="ml-auto flex items-center gap-2 shrink-0">
              <HelperCommand />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto min-h-0 flex">
        {/* Sidebar */}
        <div className="hidden lg:block shrink-0 w-[260px]">
          <aside
            className={cn(
              "w-full flex-col text-neutral-700 sticky z-30 h-[calc(85svh)] overflow-hidden overscroll-none bg-transparent md:flex",
              "top-[calc(var(--header-height,4rem)+0.6rem)] md:top-[calc(4rem+0.6rem)]",
              "[--sidebar-menu-width:--spacing(56)]"
            )}
          >
            <div className="py-6 lg:pl-6 min-h-0 h-full overflow-hidden flex flex-col">
              <OdysseySidebar />
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="min-w-0 w-full">
            <div className="w-full">{children}</div>
          </main>

          {/* Second Footer */}
          <div className="md:hidden shrink-0 border-t border-neutral-200/70 bg-white/50 backdrop-blur px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex flex-wrap gap-2 items-center justify-between">
              <Link
                href="/"
                className="text-xs text-neutral-500 hover:text-odyssey"
              >
                ← Back to Blog
              </Link>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="cursor-pointer"
              >
                <Link href="/the-odyssey">
                  <BookOpen className="size-3.5 mr-1.5" />
                  The Odyssey Walkthrough Wiki
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-neutral-200/70">
        <div className="py-6 px-8 flex flex-col sm:flex-row items-start sm:items-center justify-center gap-1 text-xs text-neutral-500">
          <p className="flex items-center gap-1">
            <span className="font-semibold text-amber-700/90">
              The Odyssey Walkthrough
            </span>
          </p>
          <p>·</p>
          <p>
            © {new Date().getFullYear()} compiled by Tianyu · Content
            under CC BY-NC 4.0
          </p>
        </div>
      </footer>
    </div>
  );
}
