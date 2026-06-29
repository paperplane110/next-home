"use client";
import { cn } from "@/lib/utils";
import { useMemo, useState, useRef } from "react";
import { useMeasure } from "react-use";
import { Drawer } from "vaul";
import { AnimatePresence, motion } from "motion/react";
import { DefaultView, KeyView } from "./components";
import { CloseIcon } from "./icons";

export function WalkthoughFamilyDrawer() {
  return (
    <div className="subsection mt-32">
      <div className="font-bold text-2xl">
        <div>
          <h2>Build a Family Drawer Component</h2>
        </div>
      </div>
      <div className="csc mt-8 relative">
        <FamilyDrawer />
      </div>
      <div className="cp">
        <p>总的来讲，这个组件的视线思路如下</p>
        <ol>
          <li>整体的<code>Sheet</code>组建，是现成的<code>Vaul</code>，提供了组件的框架，拖拽关闭等功能</li>
          <li>抽屉打开后，不同子页面的切换：<code>useMeasure + motion + AnimatePresence</code></li>
          <li>过渡分为两部分：盒子高度的过渡；内容的透明度过渡</li>
          <li>细节调整：<code>ease</code>曲线，以及根据前后盒子高度来决定过渡的持续时长</li>
        </ol>
      </div>
    </div>
  );
}

type ViewOptions = "default" | "key" | "phrase" | "remove";


export function FamilyDrawer() {
  const [view, setView] = useState<ViewOptions>("default");
  const [drawerInnerRef, bounds] = useMeasure<HTMLDivElement>();
  const previousHeightRef = useRef<number>(null)

  const duration = useMemo(() => {
    const MIN_DURATION = 0.15;
    const MAX_DURATION = 0.27;

    if (!previousHeightRef.current) {
      previousHeightRef.current = bounds.height;
      return MIN_DURATION;
    }

    const heightDiff = Math.abs(
      bounds.height - previousHeightRef.current
    )
    previousHeightRef.current = bounds.height;

    const duration = Math.min(
      Math.max(heightDiff / 500, MIN_DURATION),
      MAX_DURATION,
    );

    return duration;
  }, [bounds.height])

  const content = useMemo(() => {
    switch (view) {
      case "default":
        return <DefaultView setView={setView} />;
      case "remove":
        return (
          <div>
            <p>
              You haven’t backed up your wallet yet. If you remove it, you could
              lose access forever. We suggest tapping and backing up your wallet
              first with a valid recovery method.
            </p>
            <button onClick={() => setView("default")}>Go back</button>
          </div>
        );

      case "phrase":
        return (
          <div>
            <p>
              Keep your Secret Phrase safe. Don’t share it with anyone else. If
              you lose it, we can’t recover it.
            </p>
            <button onClick={() => setView("default")}>Go back</button>
          </div>
        );
      case "key":
        return <KeyView setView={setView} />;
    }
  }, [view]);

  return (
    <Drawer.Root>
      <Drawer.Trigger
        className="focus-visible:shadow-focus-ring-button absolute top-1/2 left-1/2 h-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white px-6 py-2 font-medium text-black transition-colors hover:bg-[#F9F9F8] md:font-medium"
      >
        Try it out
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-10 bg-black/30" />
        <Drawer.Content
          className={cn(
            "fixed inset-x-4 bottom-4 z-20 mx-auto max-w-[361px] overflow-hidden",
            "rounded-[36px] bg-[#FEFFFE] outline-hidden md:mx-auto md:w-full",
            "font-open-runde font-semibold px-6 pt-3 pb-6"
          )}
        >
          <Drawer.Title className="hidden">{view}</Drawer.Title>
          <Drawer.Close asChild>
            <button
              data-vaul-no-drag=""
              className="focus-visible:shadow-focus-ring-button absolute top-7 right-8 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F8F9] text-[#949595] transition-transform focus:scale-95 active:scale-75"
            >
              <CloseIcon />
            </button>
          </Drawer.Close>
          <motion.div
            key="wrapper"
            animate={{ height: bounds.height }}
            transition={{
              duration: 0.27,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            <div
              key="drawer-inner"
              ref={drawerInnerRef}
            >
              <AnimatePresence mode="popLayout" custom={view}>
                <motion.div
                  key={view}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: duration,
                    ease: [0.26, 0.08, 0.25, 1],
                  }}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>

    </Drawer.Root >
  );
}
