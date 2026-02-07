"use client"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function Experiment2A() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null)
  const boxesInfo = [
    {
      id: "e2-box1",
      color: "bg-amber-100",
      image: "/img/posts/23_03_08_nuxt_app_seo/seo_cover.jpg"
    },
    {
      id: "e2-box2",
      color: "bg-purple-100",
      image: "/img/playground/exp-on-layout-animation/sample.jpg"
    },
    {
      id: "e2-box3",
      color: "bg-green-100",
      image: "/img/playground/exp-on-layout-animation/sample2.jpg"
    },
    {
      id: "e2-box4",
      color: "bg-red-100",
      image: "/img/playground/exp-on-layout-animation/2022_au_mountain.jpg"
    },
  ]

  useEffect(() => {
    if (selectedBox) {
      const listener = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSelectedBox(null);
        }
      }
      addEventListener("keydown", listener);
      return () => {
        removeEventListener("keydown", listener);
      }
    }
  }, [selectedBox])

  return (
    <>
      <h3 className="font-bold mt-8">§ E2-A</h3>
      <div className="mt-8 text-sm text-muted-foreground space-y-4">
        <p>
          In this experiment, I use <code>AnimatePresence</code> and <code>layoutId</code>.
        </p>
        <p>
          Inside <code>AnimatePresence</code>, there is a semi-transparent black mask containing a box
          that shares the same <code>layoutId</code> as the selected box.
        </p>
        <p>
          I use a <strong>multi-column layout</strong> to display pictures while preserving their original aspect ratios.
          For the image component, I used <code>motion.img</code> instead of <code>Image</code> from <code>next/image</code>.
          Additionally, the image URL is a local file path, <strong>not a remote URL</strong>.
        </p>
        <p>
          This seems to have solved the bugs in E1-C.
        </p>
      </div>
      <div className="relative columns-1 sm:columns-2 gap-4 mt-8 border border-dashed border-gray-300 rounded-2xl p-4">
        {boxesInfo.map((box) => (
          <div key={box.id} className="w-full h-full">
            <motion.img
              layoutId={box.id}
              src={box.image}
              alt={box.id}
              transition={{ layout: { type: "spring", stiffness: 350, damping: 30 } }}
              className={cn(
                "flex items-center justify-center text-2xl",
                "w-full h-full mb-4",
                box.color,
                "rounded-2xl",
              )}
              onClick={() => setSelectedBox(box.id)}
            ></motion.img>
          </div>
        ))}
        <AnimatePresence>
          {selectedBox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBox(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.img
                layoutId={selectedBox}
                src={boxesInfo.find((box) => box.id === selectedBox)!.image}
                alt={selectedBox}
                transition={{ layout: { type: "spring", stiffness: 380, damping: 30 } }}
                className={cn(
                  "flex items-center justify-center object-cover",
                  "text-2xl max-w-[90%] max-h-[90%] rounded-2xl",
                  boxesInfo.find((box) => box.id === selectedBox)!.color
                )}
              >
                {/* {selectedBox} */}
              </motion.img>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}