"use client";

import { usePathname } from "next/navigation";
import { useMedia } from "react-use";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer";
import { pageList } from "@/lib/page-list";
import { Separator } from "./ui/separator";
import { HelperCommand } from "./helper-command";
import { MenuIcon, Undo2Icon, ChevronRight } from "lucide-react";



export const Navigation = () => {
  const isMobile = useMedia("(max-width: 600px)", true);
  const pathname = usePathname();

  console.log(pathname)

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <div
      className={cn(
        "z-10 section fixed top-0 left-0 right-0 border-b border-neutral-200 border-dotted",
        "bg-white/75 backdrop-blur-lg"
      )}
    >
      <nav className={cn(
        "subsection py-4 flex items-center justify-between"
      )}>
        {isMobile ? (
          <>
            <Link
              key={pageList[0].href}
              href={pageList[0].href}
              className={cn(
                "py-2 text-sm font-serif hover:text-primary",
                isActive(pageList[0].href) ? "font-semibold text-primary" : ""
              )}
            >
              {pageList[0].label}
            </Link>
            <Drawer>
              <DrawerTrigger asChild>
                <Button size="icon-sm" variant="outline" className="bg-cream-50 cursor-pointer">
                  <MenuIcon size={16} />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="flex flex-col gap-y-1 px-4 pt-2">
                  <DrawerClose asChild>
                    <Link href="/" className="flex items-center">
                      <Button variant="ghost" className="w-full">
                        <Undo2Icon className="mr-0.5 text-primary" size={16} />
                        Go to the home page
                        <ChevronRight className="ml-auto text-primary" size={16} />
                      </Button>
                    </Link>
                  </DrawerClose>
                  <Separator className="my-1" />
                  {pageList.slice(1).map((route) => (
                    <DrawerClose asChild key={route.href}>
                      <Link href={route.href} className="flex items-center">
                        <Button variant="ghost" className="w-full">
                          <route.icon className="mr-0.5 text-primary" size={16} />
                          {route.label}
                          <ChevronRight className="ml-auto text-primary" size={16} />
                        </Button>
                      </Link>
                    </DrawerClose>
                  ))}
                  <Separator className="mt-2" />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full shadow-none">
                      Close Menu
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <>
            <div className="flex gap-4">{
              pageList.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "py-2 text-sm font-serif hover:text-primary",
                    route.hidden ? "text-transparent" : "",
                    isActive(route.href) ? "text-primary" : ""
                  )}
                >
                  {route.label}
                </Link>
              ))
            }</div>
            <div className="flex items-center gap-2 h-4">
              <HelperCommand />
              <Separator orientation="vertical" />
              <Button variant="ghost" size="icon-sm" className="cursor-pointer" asChild>
                <Link href="https://github.com/paperplane110/next-home">
                  <span className="icon-[mdi--github] size-5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </nav>
    </div>
  )
}