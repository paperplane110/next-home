import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Book component
 * @param param0 
 * @returns 
 * #BUG there is a light right edge on the cover 
 * #BUG 若标题过大或过长，会撑开 book-cover-content 导致 book-cover 被撑开
 */
export function Book({
  children,
  className,
  coverColor,
  backColor,
  href,
  titleTextColor = "#0F0F0F",
  pageNumber = 300,
  bookMarginRight = 6,
  bookBindWidth = 10,
}: {
  children: ReactNode;
  className?: string;
  coverColor: string;
  backColor?: string;
  href: string;
  titleTextColor?: string;
  pageNumber?: number;
  bookMarginRight?: number;
  bookBindWidth?: number;
}) {
  const perspective = 900;
  const width = 150;
  const aspectRatio = "49/60";
  const thickness = Math.floor(pageNumber / 10);
  const edgeMarginY = 3;

  const bookCoverZ = Math.ceil(thickness / 2) + 2;  // make sure book cover is on top of book's right edge
  const bookBackZ = Math.floor(thickness / 2) * -1;
  const bookRightEdgeX = width - Math.floor(thickness / 2) - bookMarginRight;

  const bookBackColor = backColor || coverColor;

  return (
    <Link 
      href={href} 
      id="book-perspective" 
      className={cn(
        "group block relative w-[150px] aspect-49/60 perspective-[900px]",
        className
      )}
      style={{
        perspective: `${perspective}px`,
        width: `${width}px`,
        aspectRatio,
      }}
    >
      <div id="book-wrapper" className={cn(
        "w-full h-full relative",
        "will-change-transform transition-transform duration-300",
        "transform-3d hover:-rotate-y-20 hover:-translate-x-1 hover:translate-z-[50px]"
      )}
      >
        <div
          id="book-cover"
          className={cn(
            "absolute top-0 left-0 w-full h-full",
            "flex book-cover dot-texture transform"
          )}
          style={{
            backgroundColor: coverColor,
            translate: `0 0 ${bookCoverZ}px`
          }}
        >
          <div id="book-bind" className="h-full book-bind-bg" style={{ width: `${bookBindWidth}%` }} />
          <div 
            id="book-cover-content" 
            className="z-1 flex-1 wrap-break-word whitespace-normal p-2 text-base font-serif font-semibold soft-70 book-text-shadow"
            style={{ color: titleTextColor }}
          >
            {children}
          </div>
        </div>
        <div
          id="book-right-edge"
          className="absolute z-[-1] bg-muted border-y rotate-y-90"
          style={{
            top: `${edgeMarginY}px`,
            height: `calc(100% - ${edgeMarginY * 2}px)`,
            width: `${thickness}px`,
            translate: `${bookRightEdgeX}px 0 0`
          }}
        />
        <div
          id="book-back"
          className="absolute z-[-2] top-0 left-0 w-full h-full book-cover"
          style={{ backgroundColor: bookBackColor, translate: `0 0 ${bookBackZ}px`}}
        />
      </div>
    </Link>
  )
}