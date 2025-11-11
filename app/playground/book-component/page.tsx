"use client"
import OuterLink from "@/components/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book } from "@/components/book/book";

export default function BookComponentPage() {
  const [bookTitle, setBookTitle] = useState("Animal Farm");
  const [titleSize, setTitleSize] = useState("1.2");
  const [isRotated, setIsRotated] = useState(false);
  const [bookEdgeDepth, setBookEdgeDepth] = useState(7);
  const [bookThickness, setBookThickness] = useState(80);
  const width = 150;
  const aspectRatio = "49/60"
  const perspective = 900;
  const bookCoverZ = Math.ceil(bookThickness / 2) + 2;
  const bookBackZ = Math.ceil(bookThickness / 2) * -1;
  const edgeMarginY = 3;

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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-4">
          <Book
            coverColor="#658C58"
            backColor="hsl(120, 20%, 30%)"
            href="/reading/25-08-17-never-let-me-go"
            titleTextColor="#FFFFFF"
            bookMarginRight={5}
          >
            <span className="text-xl">Never Let Me Go</span>
          </Book>
          <Book
            coverColor="hsl(208, 40%, 80%)"
            backColor="hsl(208, 40%, 55%)"
            href="/reading/25-02-16-1984"
            titleTextColor="hsl(208, 40%, 25%)"
            bookMarginRight={5}
            pageNumber={360}
          >
            <span className="text-2xl font-serif">1984</span>
          </Book>
          <Book
            coverColor="#FFC400"
            backColor="hsl(40, 100%, 40%)"
            href="/reading/24-12-06-master-of-doom"
            titleTextColor="#0F0F0F"
            bookMarginRight={5}
          >
            <div className="font-mono h-full">
              <p className="text-xl">Master of Doom</p>
              <p className="pt-12 text-[11px]/3 text-yellow-800">How Two Guys Created an Empire and Transformed Pop Culture</p>
            </div>
          </Book>
        </div>
      </div>

      <div className="subsection mt-12 grid grid-cols-2 sm:grid-cols-3 gap-8">
        <div className="col-span-2 sm:col-span-3">
          <h2 className="mb-4 font-bold">Book Component Controls</h2>
          <div className="grid grid-cols-[130px_1fr] gap-2 items-center">
            <div>Book Title: </div><Input className="inline-block w-40 h-8" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} />
            <div>Title Size: </div><Input className="inline-block w-20 h-8" type="number" step={0.1} value={titleSize} onChange={(e) => setTitleSize(e.target.value)} />
            <div>isRotated: </div><Button size="sm" variant="outline" className="mr-auto" onClick={() => setIsRotated(!isRotated)}>{isRotated.toString()}</Button>
            <div>bookEdgeDepth: </div><Input className="inline-block w-20 h-8" type="number" value={bookEdgeDepth} onChange={(e) => setBookEdgeDepth(Number(e.target.value))} />
            <div>bookThickness: </div><Input className="inline-block w-20 h-8" type="number" value={bookThickness} onChange={(e) => setBookThickness(Number(e.target.value))} />
          </div>
        </div>
        <div id="scene"
          style={{
            perspective: `${perspective}px`,
            width: `${width}px`,
            aspectRatio,
          }}
        >
          <div id="book-wrapper" className={cn(
            "w-full h-full relative",
            "will-change-transform transition-transform duration-300 ease-out transform-3d",
            isRotated && "-rotate-y-20 -translate-x-1 translate-z-[50px]"
          )}
            onClick={() => setIsRotated(!isRotated)}
          >
            <div
              id="book-cover"
              className={cn(
                "absolute top-0 left-0 w-full h-full",
                "flex bg-amber-300 book-cover dot-texture transform"
              )}
              style={{
                translate: `0 0 ${bookCoverZ}px`
              }}
            >
              <div id="book-bind" className="h-full book-bind-bg w-[10%]" />
              <div id="book-cover-content" className="z-1 flex-1 wrap-break-word whitespace-normal p-2 text-base font-serif font-semibold soft-70 book-text-shadow">
                <span style={{ fontSize: `${titleSize}rem`, lineHeight: "1.2" }}>{bookTitle}</span>
              </div>
            </div>
            <div
              id="book-right-edge"
              className="absolute z-[-1] bg-muted border-b border-gray-300 transform rotate-y-90"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness}px`,
                translate: `${width - bookThickness / 2 - bookEdgeDepth}px 0 0`
              }}
            />
            <div
              id="book-back"
              className="absolute z-[-2] top-0 left-0 w-full h-full book-cover bg-amber-600 transform"
              style={{ translate: `0 0 ${bookBackZ}px` }}
            />
          </div>
        </div>
        <div id="scene"
          style={{
            perspective: `${perspective}px`,
            width: `${width}px`,
            aspectRatio,
          }}
        >
          <div id="book-wrapper" className={cn(
            "w-full h-full relative",
            "will-change-transform transition-transform duration-300 ease-out transform-3d",
            isRotated && "-rotate-y-20 -translate-x-1 translate-z-[50px]"
          )}
            onClick={() => setIsRotated(!isRotated)}
          >
            <div
              id="book-cover"
              className={cn(
                "absolute top-0 left-0 w-full h-full",
                "flex bg-amber-300/20 book-cover transform border border-black"
              )}
              style={{
                translate: `0 0 ${bookCoverZ}px`
              }}
            >
              <div id="book-bind" className="h-full book-bind-bg w-[10%]" />
              <div id="book-cover-content" className="z-1 flex-1 wrap-break-word whitespace-normal p-2 text-base font-serif font-semibold soft-70 book-text-shadow">
                <span style={{ fontSize: `${titleSize}rem`, lineHeight: "1.2" }}>{bookTitle}</span>
              </div>
            </div>
            <div
              id="book-right-edge"
              className="absolute z-[-1] bg-white transform rotate-y-90 border border-black"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness}px`,
                translate: `${width - bookThickness / 2 - bookEdgeDepth}px 0 0`
              }}
            />
            <div
              id="book-back"
              className="absolute z-[-2] top-0 left-0 w-full h-full book-cover bg-amber-300/10 border border-black transform"
              style={{ translate: `0 0 ${bookBackZ}px` }}
            />
          </div>
        </div>
        <div id="scene"
          style={{
            perspective: `${perspective}px`,
            width: `${width}px`,
            aspectRatio,
          }}
        >
          <div id="book-wrapper" className={cn(
            "w-full h-full relative",
            "will-change-transform transition-transform duration-300 ease-out transform-3d",
            isRotated && "-rotate-y-20 -translate-x-1 translate-z-[50px]"
          )}
            onClick={() => setIsRotated(!isRotated)}
          >
            <div
              id="book-cover"
              className={cn(
                "absolute top-0 left-0 w-full h-full",
                "flex bg-[#2b4768] book-cover dot-texture transform"
              )}
              style={{
                translate: `0 0 ${bookCoverZ}px`
              }}
            >
              <div id="book-bind" className="h-full book-bind-bg w-[10%]" />
              <div id="book-cover-content" className="z-1 flex-1 wrap-break-word whitespace-normal p-2 text-base font-serif font-semibold soft-70 book-text-shadow">
                <span className="text-white" style={{ fontSize: `${titleSize}rem`, lineHeight: "1.2" }}>{bookTitle}</span>
              </div>
            </div>
            <div
              id="book-right-edge"
              className="absolute z-[-1] bg-muted border-b border-gray-300 transform rotate-y-90 book-right-edge-bg"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness}px`,
                translate: `${width - bookThickness / 2 - bookEdgeDepth}px 0 0`
              }}
            />
            <div
              id="book-back"
              className="absolute z-[-2] top-0 left-0 w-full h-full book-cover bg-[#5082ba] transform"
              style={{ translate: `0 0 ${bookBackZ}px` }}
            />
          </div>
        </div>
      </div>

      <div className="subsection mt-12">
        <h2 className="font-bold">Book shelf and pick out anmation</h2>
        <div className="mt-4 text-muted-foreground">Summary:
          <ul className="mt-2 list-disc">
            <li>首先，效果不是很理想，因为俯视图来看，书封书底厚度为 0</li>
            <li>book 组件应该重新编写，其“正面”应该是 book-bind，而非目前的 book-cover。
              原因在于当书籍横向排列时，使用 flex 布局，每个元素的宽度为书的宽度，而非厚度，导致了间隔过大。
            </li>
            <li>book 组件不应该包含作为 3d 容器的 scene，应该单独写一个 3d 容器组件，内部放置多个 book</li>
          </ul>
        </div>
        <div id="scene"
          className="mt-8 flex flex-row justify-start"
          style={{
            perspective: `${perspective}px`,
          }}
        >
          <div id="book-wrapper" className={cn(
            "z-20",
            "h-full relative",
            "will-change-transform transition-transform duration-300 ease-out transform-3d rotate-y-90",
            // isRotated && "-rotate-z-20"
          )}
            style={{
              width: `${width}px`,
              aspectRatio: `${aspectRatio}`
            }}
            onClick={() => setIsRotated(!isRotated)}
          >
            <div
              id="book-cover"
              className={cn(
                "absolute top-0 left-0 w-full h-full",
                "flex bg-[#2b4768] book-cover dot-texture transform"
              )}
              style={{
                translate: `0 0 ${bookCoverZ}px`
              }}
            >
              <div id="book-cover-bind" className="h-full book-bind-bg w-[10%]" />
              <div id="book-cover-content" className="z-1 flex-1 wrap-break-word whitespace-normal p-2 text-base font-serif font-semibold soft-70 book-text-shadow">
                <span className="text-white" style={{ fontSize: `${titleSize}rem`, lineHeight: "1.2" }}>{bookTitle}</span>
              </div>
            </div>
            <div
              id="book-right-edge"
              className="absolute z-[-1] bg-muted border-b border-gray-300 rotate-y-90 book-right-edge-bg"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness}px`,
                translate: `${width - bookThickness / 2 - bookEdgeDepth}px 0 0`
              }}
            />
            <div
              id="book-bind"
              className="absolute z-[-1] -rotate-y-90 bg-[#2b4768]"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness + 3}px`,
                translate: `${-bookThickness / 2}px 0 0`
              }}
            >
              <div id="book-bind-title" className="h-full w-full flex items-center justify-center text-white font-bold text-xl"
                style={{
                  writingMode: "vertical-lr",
                  textOrientation: "mixed"
                }}
              >
                Animal Farm
              </div>
            </div>
            <div
              id="book-top"
              className="absolute top-0 left-0 bg-muted border rotate-x-90"
              style={{
                height: `${bookThickness}px`,
                width: `calc(${width}px - ${bookEdgeDepth}px)`,
                translate: `0 ${-bookThickness / 2 + 3}px 0`
              }}
            >

            </div>
            <div
              id="book-back"
              className="absolute z-[-2] top-0 left-0 w-full h-full book-cover bg-[#5082ba] transform"
              style={{ translate: `0 0 ${bookBackZ}px` }}
            />
          </div>

          <div id="book-wrapper" className={cn(
            "w-[150px] h-full relative",
            "will-change-transform transition-transform duration-300 ease-out transform-3d rotate-y-90",
            isRotated && "-rotate-z-20 translate-z-[50px]"
          )}
            style={{
              width: `${width}px`,
              aspectRatio: `${aspectRatio}`
            }}
            onClick={() => setIsRotated(!isRotated)}
          >
            <div
              id="book-cover"
              className={cn(
                "absolute top-0 left-0 w-full h-full",
                "flex bg-[#2b4768] book-cover dot-texture transform"
              )}
              style={{
                translate: `0 0 ${bookCoverZ}px`
              }}
            >
              <div id="book-cover-bind" className="h-full book-bind-bg w-[10%]" />
              <div id="book-cover-content" className="z-1 flex-1 wrap-break-word whitespace-normal p-2 text-base font-serif font-semibold soft-70 book-text-shadow">
                <span className="text-white" style={{ fontSize: `${titleSize}rem`, lineHeight: "1.2" }}>{bookTitle}</span>
              </div>
            </div>
            <div
              id="book-right-edge"
              className="absolute z-[-1] bg-muted border-b border-gray-300 rotate-y-90 book-right-edge-bg"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness}px`,
                translate: `${width - bookThickness / 2 - bookEdgeDepth}px 0 0`
              }}
            />
            <div
              id="book-bind"
              className="absolute z-[-1] -rotate-y-90 bg-[#2b4768]"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness + 3}px`,
                translate: `${-bookThickness / 2}px 0 0`
              }}
            >
              <div id="book-bind-title" className="h-full w-full flex items-center justify-center text-white font-bold text-xl"
                style={{
                  writingMode: "vertical-lr",
                  textOrientation: "mixed"
                }}
              >
                Animal Farm
              </div>
            </div>
            <div
              id="book-top"
              className="absolute top-0 left-0 bg-muted border rotate-x-90"
              style={{
                height: `${bookThickness}px`,
                width: `calc(${width}px - ${bookEdgeDepth}px)`,
                translate: `0 ${-bookThickness / 2 + 3}px 0`
              }}
            />
            <div
              id="book-back"
              className="absolute z-[-2] top-0 left-0 w-full h-full book-cover bg-[#5082ba] transform"
              style={{ translate: `0 0 ${bookBackZ}px` }}
            />
          </div>

          <div id="book-wrapper" className={cn(
            "w-[150px] h-full relative",
            "will-change-transform transition-transform duration-300 ease-out transform-3d rotate-y-90",
            // isRotated && "-rotate-z-20 translate-z-[50px]"
          )}
            style={{
              width: `${width}px`,
              aspectRatio: `${aspectRatio}`
            }}
            onClick={() => setIsRotated(!isRotated)}
          >
            <div
              id="book-cover"
              className={cn(
                "absolute top-0 left-0 w-full h-full",
                "flex bg-[#2b4768] book-cover dot-texture transform"
              )}
              style={{
                translate: `0 0 ${bookCoverZ}px`
              }}
            >
              <div id="book-cover-bind" className="h-full book-bind-bg w-[10%]" />
              <div id="book-cover-content" className="z-1 flex-1 wrap-break-word whitespace-normal p-2 text-base font-serif font-semibold soft-70 book-text-shadow">
                <span className="text-white" style={{ fontSize: `${titleSize}rem`, lineHeight: "1.2" }}>{bookTitle}</span>
              </div>
            </div>
            <div
              id="book-right-edge"
              className="absolute z-[-1] bg-muted border-b border-gray-300 rotate-y-90 book-right-edge-bg"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness}px`,
                translate: `${width - bookThickness / 2 - bookEdgeDepth}px 0 0`
              }}
            />
            <div
              id="book-bind"
              className="absolute z-[-1] -rotate-y-90 bg-[#2b4768]"
              style={{
                top: `${edgeMarginY}px`,
                height: `calc(100% - ${edgeMarginY * 2}px)`,
                width: `${bookThickness + 3}px`,
                translate: `${-bookThickness / 2}px 0 0`
              }}
            >
              <div id="book-bind-title" className="h-full w-full flex items-center justify-center text-white font-bold text-xl"
                style={{
                  writingMode: "vertical-lr",
                  textOrientation: "mixed"
                }}
              >
                Animal Farm
              </div>
            </div>
            <div
              id="book-top"
              className="absolute top-0 left-0 bg-muted border rotate-x-90"
              style={{
                height: `${bookThickness}px`,
                width: `calc(${width}px - ${bookEdgeDepth}px)`,
                translate: `0 ${-bookThickness / 2 + 3}px 0`
              }}
            />
            <div
              id="book-back"
              className="absolute z-[-2] top-0 left-0 w-full h-full book-cover bg-[#5082ba] transform"
              style={{ translate: `0 0 ${bookBackZ}px` }}
            />
          </div>
        </div>
      </div>


      <div className="subsection mt-12">
        <h2 className="font-bold">References</h2>
        <ul className="mt-4 list-disc text-muted-foreground">
          <li>CSS 3D rotate: <OuterLink className="underline" href="https://3dtransforms.desandro.com/perspective">https://3dtransforms.desandro.com/perspective</OuterLink></li>
          <li>Book cover edge&apos;s highlight: <OuterLink className="underline" href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow">inset shadow</OuterLink></li>
        </ul>
      </div>
    </div>
  )
}
