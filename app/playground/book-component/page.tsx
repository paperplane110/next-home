"use client"
import OuterLink from "@/components/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book } from "@/components/book";

export default function BookComponentPage() {
  const [bookTitle, setBookTitle] = useState("Animal Farm");
  const [titleSize, setTitleSize] = useState("1.2");
  const [isRotated, setIsRotated] = useState(false);
  const [bookEdgeDepth, setBookEdgeDepth] = useState(7);

  return (
    <div className="section page-top-margin">
      <div className="subsection">
        <h1 className="headline font-serif font-light soft-70">
          Book Component
          <span className="text-pink-600">.</span>
        </h1>
      </div>
      <div className="subsection mt-8">
        <p className="text-muted-foreground">
          A book component with a cover and a page with hover-3d-rotation effect,
          inspired by <OuterLink className="underline" href="https://ai-sdk.dev/cookbook">ai sdk cookbook</OuterLink>
        </p>
      </div>
      <div className="subsection mt-12">
        <div>
          <h2 className="font-bold">Book List Preview</h2>
        </div>
        <div className="grid grid-cols-3 mt-4">
          <Book
            coverColor="#658C58"
            href="/reading/25-08-17-never-let-me-go"
            titleTextColor="#FFFFFF"
            bookEdgeDepth={5}
          >
            <span className="text-2xl">Never Let Me Go</span>
          </Book>
          <Book
            coverColor="#811844"
            href="/reading/25-02-16-1984"
            titleTextColor="#FFFFFF"
            bookEdgeDepth={5}
          >
            <span className="text-2xl">1984</span>
          </Book>
          <Book
            coverColor="#E9B63B"
            href="/reading/24-12-06-master-of-doom"
            titleTextColor="#0F0F0F"
            bookEdgeDepth={5}
          >
            <span className="text-2xl">Master of Doom</span>
          </Book>
        </div>
      </div>

      <div className="subsection mt-12 grid grid-cols-3 gap-8">
        <div className="col-span-3">
          <h2 className="mb-4 font-bold">Book Component Controls</h2>
          <p className="mb-2">Book Title: <Input className="inline-block w-40" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} /></p>
          <p className="mb-2">Title Size: <Input className="inline-block w-20" type="number" step={0.1} value={titleSize} onChange={(e) => setTitleSize(e.target.value)} /> rem</p>
          <p>isRotated: <Button variant="outline" onClick={() => setIsRotated(!isRotated)}>{isRotated.toString()}</Button></p>
          <p>bookEdgeDepth: <Input className="inline-block w-20" type="number" value={bookEdgeDepth} onChange={(e) => setBookEdgeDepth(Number(e.target.value))} /></p>
        </div>

        <div id="scene" className="group w-[150px] aspect-49/60 perspective-[900px]"
          onClick={() => setIsRotated(!isRotated)}
        >
          <div id="book-cover-wrapper"
            className={cn(
              "flex justify-start w-full h-full bg-[#48547e]/50 border border-black rounded-sm",
              "transform transition-all duration-300 ease-out",
              isRotated && "-translate-x-3 -rotate-y-20 translate-z-[50px]"
            )}
          >
            <div id="book-bind" className="w-[0.8rem] h-full bg-blend-overlay book-bind-bg opacity-100" />
            <div id="book-cover" className="p-2 font-semibold soft-70 text-white font-serif"
              style={{ fontSize: `${titleSize}rem` }}
            >
              {bookTitle}
            </div>
          </div>
          <div
            id="book-page"
            className={cn(
              "absolute -z-10 top-0 w-[50px] h-full bg-[#f5f5f5] border border-black",
              "transform origin-left -translate-z-[25px] rotate-y-85",
              "transition-all duration-300 ease-out",
              isRotated && "rotate-y-75 -translate-x-2 translate-z-[25px]"
            )}
            style={{ left: `${100 - bookEdgeDepth}%` }}
          />
          <div
            id="book-back"
            className={cn(
              "absolute -z-20 top-0 left-0 w-full h-full bg-[#48547e]/20 border border-black rounded-sm",
              "transform transition-all duration-300 ease-out translate-z-[-50px]",
              isRotated && "translate-z-0 -rotate-y-20 translate-x-0.5"
            )}
          />
        </div>

        <div id="scene" className="group w-[150px] aspect-49/60 perspective-[900px]"
          onClick={() => setIsRotated(!isRotated)}
        >
          <div id="book-cover-wrapper"
            className={cn(
              "flex w-full h-full bg-[#48547e] book-cover",
              "transform transition-all duration-300 ease-out",
              isRotated && "-translate-x-3 -rotate-y-20 translate-z-[50px]"
            )}
          >
            <div id="book-bind" className="w-3 h-full book-bind-bg" />
            <div id="book-cover" className="p-2 font-semibold soft-70 text-white book-text-shadow font-serif"
              style={{ fontSize: `${titleSize}rem` }}
            >
              {bookTitle}
            </div>
          </div>
          <div
            id="book-page"
            className={cn(
              "absolute -z-10 top-0 w-[50px] h-full bg-[#f5f5f5] border border-black",
              "transform origin-left -translate-z-[25px] rotate-y-85",
              "transition-all duration-300 ease-out",
              isRotated && "rotate-y-75 -translate-x-2 translate-z-[25px]"
            )}
            style={{ left: `${100 - bookEdgeDepth}%` }}
          />
          <div
            id="book-back"
            className={cn(
              "absolute -z-20 top-0 left-0 w-full h-full bg-[#48547e] border border-black rounded-sm",
              "transform transition-all duration-300 ease-out translate-z-[-50px]",
              isRotated && "translate-z-0 -rotate-y-20 translate-x-0.5"
            )}
          />
        </div>
      </div>
      <div className="subsection mt-12">
        <p className="mt-4">References:</p>
        <ul className="mt-2 list-disc text-muted-foreground">
          <li>CSS 3D rotate: <OuterLink className="underline" href="https://3dtransforms.desandro.com/perspective">https://3dtransforms.desandro.com/perspective</OuterLink></li>
          <li>Book cover shadow: <OuterLink className="underline" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow">https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow</OuterLink></li>
        </ul>
      </div>
    </div>
  )
}
