import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Book({
  children,
  className,
  coverColor,
  href,
  titleTextColor = "#0F0F0F",
  bookEdgeDepth = 6,
  bookBindWitdth = 10,
}: {
  children: ReactNode;
  className?: string;
  coverColor: string;
  href: string;
  titleTextColor?: string;
  bookEdgeDepth?: number;
  bookBindWitdth?: number;
}) {
  return (
    <Link 
      href={href} 
      id="book-perspective" 
      className={cn(
        "group block relative w-[150px] aspect-49/60 perspective-[900px]",
        className
      )}
    >
      <div id="book-cover-wrapper"
        className={cn(
          "flex w-full h-full book-cover",
          "transform transition-all duration-300 ease-out",
          "group-hover:-translate-x-3 group-hover:-rotate-y-20 group-hover:translate-z-[50px]"
        )}
        style={{ 
          backgroundColor: coverColor,
          color: titleTextColor,
        }}
      >
        <div id="book-bind" className="h-full book-bind-bg" style={{ width: `${bookBindWitdth}%` }} />
        <div id="book-cover" className="flex-1 p-2 text-base font-serif font-semibold soft-70 book-text-shadow">
          {children}
        </div>
      </div>
      <div
        id="book-page"
        className={cn(
          "absolute -z-10 top-0 w-[50px] h-full bg-[#f5f5f5]",
          "transform origin-left -translate-z-[25px] rotate-y-85",
          "transition-all duration-300 ease-out",
          "group-hover:rotate-y-75 group-hover:-translate-x-2 group-hover:translate-z-[25px]"
        )}
        style={{ left: `${100 - bookEdgeDepth}%` }}
      />
      <div
        id="book-back"
        className={cn(
          "absolute -z-20 top-0 left-0 w-full h-full rounded-sm",
          "transform translate-z-[-50px] transition-all duration-300 ease-out",
          "group-hover:translate-z-0 group-hover:-rotate-y-20 group-hover:translate-x-0.5"
        )}
        style={{ backgroundColor: coverColor }}
      />
    </Link>
  )
}