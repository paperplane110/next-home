"use client";

import { usePathname } from "next/navigation";
import { useMedia } from "react-use";

import { cn } from "@/lib/utils";
import Link from "next/link";

const routes = [
  {
    href: "/",
    label: "Home"
  },
  {
    href: "/posts",
    label: "Writing"
  },
  {
    href: "/reading",
    label: "Reading"
  },
  {
    href: "/gallery",
    label: "Gallery"
  },
  {
    href: "/about",
    label: "About"
  },
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
    <div className="section fixed top-0 left-0 right-0 backdrop-blur-md border-b border-gray-100">
      <nav className="subsection py-4 flex items-center justify-start gap-4">
        {isMobile ? routes.slice(0, 1).map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "py-2 text-sm font-serif text-gray-700 hover:text-pink-600",
              isActive(route.href) ? "font-semibold text-pink-700" : ""
            )}
          >
            {route.label}
          </Link>
        )) : (
          routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "py-2 text-sm font-serif text-gray-700 hover:text-pink-600",
                isActive(route.href) ? "text-pink-700" : ""
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