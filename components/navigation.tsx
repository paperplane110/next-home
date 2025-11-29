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
import { CameraIcon, ChevronRight, FileUserIcon, HomeIcon, LibraryIcon, MenuIcon, PencilLineIcon, PuzzleIcon, Undo2Icon } from "lucide-react";
import { Separator } from "./ui/separator";

const routes = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "/posts",
    label: "Writing",
    icon: PencilLineIcon,
  },
  {
    href: "/reading",
    label: "Reading",
    icon: LibraryIcon,
  },
  {
    href: "/gallery",
    label: "Gallery",
    icon: CameraIcon,
  },
  {
    href: "/about",
    label: "About",
    icon: FileUserIcon,
  },
  {
    href: "/playground",
    label: "Playground",
    icon: PuzzleIcon,
    hidden: true,
  }
]

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
        "subsection py-4 flex items-center justify-start gap-4",
        isMobile && "justify-between"
      )}>
        {isMobile ? (
          <>
            <Link
              key={routes[0].href}
              href={routes[0].href}
              className={cn(
                "py-2 text-sm font-serif hover:text-primary",
                isActive(routes[0].href) ? "font-semibold text-primary" : ""
              )}
            >
              {routes[0].label}
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
                  {routes.slice(1).map((route) => (
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
          routes.map((route) => (
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
        )}
      </nav>
    </div>
  )
}