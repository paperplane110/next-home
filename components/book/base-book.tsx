import { cn } from "@/lib/utils";
type NewBookProps = {
  children?: React.ReactNode,
  // book width, px
  width?: number,
  // book aspect ratio, e.g. "49/60"
  aspectRatio?: string,
  // book perspective distance, px
  perspective?: number,
  // book thickness, px
  thickness?: number,
  // book right edge depth, px
  edgeMarginRight?: number,
  edgeMarginY?: number,
}

export const NewBook = ({
  children,
  width = 150,
  aspectRatio = "49/60",
  perspective = 900,
  thickness = 40,
  edgeMarginRight = 5,
  edgeMarginY = 3,
}: NewBookProps) => {

  const bookCoverZ = Math.ceil(thickness / 2) + 1;  // make sure book cover is on top of book's right edge
  const bookBackZ = Math.floor(thickness / 2) * -1;
  const bookRightEdgeX = width - Math.floor(thickness / 2) - edgeMarginRight;

  return (
    <div id="scene"
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
            "flex bg-amber-300 book-cover dot-texture transform"
          )}
          style={{
            translate: `0 0 ${bookCoverZ}px`
          }}
        >
          <div id="book-bind" className="h-full book-bind-bg w-[10%]" />
          <div id="book-cover-content" className="z-1 flex-1 wrap-break-word whitespace-normal p-2 text-base font-serif font-semibold soft-70 book-text-shadow">
            {children}
          </div>
        </div>
        <div
          id="book-right-edge"
          className="absolute z-[-1] bg-muted border-y transform rotate-y-90"
          style={{
            top: `${edgeMarginY}px`,
            height: `calc(100% - ${edgeMarginY * 2}px)`,
            width: `${thickness}px`,
            translate: `${bookRightEdgeX}px 0 0`
          }}
        />
        <div
          id="book-back"
          className="absolute z-[-2] top-0 left-0 w-full h-full book-cover bg-amber-300 transform"
          style={{ translate: `0 0 ${bookBackZ}px`}}
        />
      </div>
    </div>
  )
}