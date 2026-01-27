"use client"
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useScroll } from "motion/react";

export default function ColorfulDropShadowEffectOnTextPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const thresholds = [0.2, 0.4, 0.6, 0.8];

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      // Update progress (if you use CSS driven effects with --progress)
      setProgress(latest);

      // Compute index by finding the first threshold that latest is below
      const nextIndex = thresholds.findIndex((t) => latest < t);

      // Avoid redundant state updates
      setActiveIndex((prev) => (prev !== nextIndex ? nextIndex : prev));
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <div className="section page-top-margin">
      <div className="subsection">
        <h1 className="headline font-serif font-light soft-70">
          Colorful drop shadow effect on text
        </h1>
        <p className="mt-8 text-sm font-medium text-muted-foreground">
          A demo of colorful drop shadow effect on text. Inspired by the landing page of&nbsp;
          <Link href="https://dub.co/" className="underline">dub</Link>.
        </p>
        <p className="mt-8 text-sm font-medium text-muted-foreground">Features</p>
        <ul className="mt-2 text-sm text-muted-foreground">
          <li>Colourful drop shadow effect on text</li>
          <li>Scrolling progress will trigger the effect</li>
          <li>Parallax, dot pattern background will scroll slowly relative to the text</li>
        </ul>
      </div>
      <div className="subsection mt-16">
        <h2 className="text-base font-bold">Example:</h2>
        <hr className="" />
        <div ref={ref}
          className={cn(
            "py-16 text-3xl font-medium leading-normal relative",
            `--progress: ${progress}`,
          )}
        >
          <div
            id="dot-bg"
            className={cn(
              "absolute inset-x-[-4] inset-y-8 pointer-events-none",
            )}
            style={{
              backgroundImage: "radial-gradient(#d1d5db95 1px, transparent 1px)",
              backgroundSize: "12px 12px",
              mixBlendMode: "darken",
              transition: "transform",
              transform: `translateY(${progress * 32}px)`,
            }}
            aria-hidden
          ></div>
          <div>
            <p>
              I&apos;ve been working as a Senior SET <span className="text-muted-foreground">(software engineer in test)</span> at DiDi Robotaxi team
              <Link
                href="https://www.didiglobal.com/science/intelligent-driving"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group relative"
                data-active={activeIndex === 0 ? 'true' : 'false'}
              >
                <span className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 w-56 h-24 -translate-x-1/2 -translate-y-1/2",
                  "text-orange-400 saturate-[1.5] mix-blend-screen bg-[radial-gradient(closest-side_ellipse,currentColor,black)]",
                  "transition-opacity duration-500 opacity-0 group-hover:opacity-100",
                  "group-data-[active=true]:opacity-100"
                )}></span>
                <span
                  className={cn(
                    "size-7 mx-1.5 inline-flex items-center justify-center",
                    "bg-orange-400 text-orange-900 border border-black/5 rounded-md",
                    "transition-transform duration-300 group-hover:translate-y-[-6px] group-hover:-rotate-10",
                    "group-data-[active=true]:translate-y-[-6px] group-data-[active=true]:-rotate-10",
                  )}>
                  <span className="icon-[material-symbols--local-taxi] size-5"></span>
                </span>
              </Link>
              . Responsible for managing and maintaining several HiL <span className="text-muted-foreground">(Hardware in Loop simulation)</span> test environments.
            </p>
            <p className="mt-8">
              From 2022.12 to 2024.11, I was a SET in Baidu Apollo
              <Link
                href="https://www.apollo.auto/apollo-self-driving"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group relative"
                data-active={activeIndex === 1 ? 'true' : 'false'}
              >
                <span className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 w-56 h-24 -translate-x-1/2 -translate-y-1/2",
                  "text-green-400 saturate-[1.5] mix-blend-screen bg-[radial-gradient(closest-side_ellipse,currentColor,black)]",
                  "transition-opacity duration-500 opacity-0 group-hover:opacity-100",
                  "group-data-[active=true]:opacity-100"
                )}></span>
                <span
                  className={cn(
                    "size-7 mx-1.5 inline-flex items-center justify-center",
                    "bg-green-400 text-green-900 border border-black/5 rounded-md",
                    "transition-transform duration-300 group-hover:translate-y-[-6px] group-hover:rotate-10",
                    "group-data-[active=true]:translate-y-[-6px] group-data-[active=true]:rotate-10",
                  )}>
                  <span className="icon-[material-symbols--automation] size-5"></span>
                </span>
              </Link>
              . Focusing on L3 system&apos;s HiL test platfrom and test toolchain development.
            </p>
            <p className="mt-8">
              In 2020, after graduation, I started my career as a SET in Aibee
              <Link
                href="https://www.aibee.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group relative"
                data-active={activeIndex === 2 ? 'true' : 'false'}
              >
                <span className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 w-56 h-24 -translate-x-1/2 -translate-y-1/2",
                  "text-orange-400 saturate-[1.5] mix-blend-screen bg-[radial-gradient(closest-side_ellipse,currentColor,black)]",
                  "transition-opacity duration-500 opacity-0 group-hover:opacity-100",
                  "group-data-[active=true]:opacity-100"
                )}>

                </span>
                <span
                  className={cn(
                    "size-7 mx-1.5 inline-flex items-center justify-center",
                    "transition-transform duration-300 group-hover:translate-y-[-6px]",
                    "group-data-[active=true]:translate-y-[-6px]"
                  )}>
                  🐝
                </span>
              </Link>
              . Mainly testing face recognition model and liveness model.
            </p>
            <p className="mt-8">
              Recently, I&apos;m interested in Full-Stack technology, UI design, 3D arts, and games
              <Link
                href="https://steamcommunity.com/profiles/76561198295064500/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group relative"
                data-active={activeIndex === 3 ? 'true' : 'false'}
              >
                <span className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 w-56 h-24 -translate-x-1/2 -translate-y-1/2",
                  "text-blue-400 saturate-[1.5] mix-blend-screen bg-[radial-gradient(closest-side_ellipse,currentColor,black)]",
                  "transition-opacity duration-500 opacity-0 group-hover:opacity-100",
                  "group-data-[active=true]:opacity-100"
                )}>

                </span>
                <span
                  className={cn(
                    "mx-1.5 inline-flex items-center justify-center translate-y-1",
                  )}>
                  <span className="icon-[mdi--steam]"></span>
                </span>
              </Link>
              of course.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
