"use client"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Experiment1() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null)
  const boxesInfo = [
    {
      id: "e1-box1",
      color: "border-amber-400 bg-amber-100",
      image: "/img/posts/23_03_08_nuxt_app_seo/seo_cover.jpg"
    },
    {
      id: "e1-box2",
      color: "border-purple-400 bg-purple-100",
      image: "/img/playground/exp-on-layout-animation/sample.jpg"
    },
    {
      id: "e1-box3",
      color: "border-green-400 bg-green-100",
      image: "/img/playground/exp-on-layout-animation/sample2.jpg"
    },
    {
      id: "e1-box4",
      color: "border-red-400 bg-red-100",
      image: "/img/playground/exp-on-layout-animation/2022_au_mountain.jpg"
    },
  ]
  return (
    <div className="subsection mt-16">
      <h2 className="font-bold text-2xl">Experiment 1: Layout Animation</h2>


      <h3 className="font-bold mt-8">§ E1-A</h3>
      <div className="mt-4 space-y-6 [&>p+ul]:-mt-4 text-base text-muted-foreground">
        <p>
          In this experiment, I only used <code>layout</code> animation. When you click on a box,
          the new layout css will be applied to the box: from grid position to absolute position.
        </p>
        <p>
          But there are some problems:
          Also, the text in the box will jump from a small size to a large size when the box is expanding.
          That is because of <code>motion</code> use scale to animate the layout change.
        </p>
        <ul className="mt-2">
          <li>
            The other boxed will fill the empty position in the grid, which is not expected.
          </li>
          <li>
            The text in the box will jump from a small size to a large size when the box is expanding.
          </li>
        </ul>
      </div>
      <div className="relative grid grid-cols-2 mt-8 h-96 border-2 border-dashed border-blue-400 rounded-2xl p-2 gap-4">
        {boxesInfo.map((box) => (
          <motion.div
            key={box.id}
            layout
            transition={{ layout: { type: "spring", stiffness: 350, damping: 30 } }}
            className={cn(
              "flex items-center justify-center text-2xl",
              "border-2 border-dashed",
              box.color,
              "rounded-2xl",
              selectedBox === box.id && "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[80%] h-[80%] z-5"
            )}
            onClick={() => {
              if (selectedBox === box.id) {
                setSelectedBox(null)
              } else {
                setSelectedBox(box.id)
              }
            }}
          >{box.id}</motion.div>
        ))}
      </div>
      <hr className="w-full my-8" />


      <h3 className="font-bold mt-8">§ E1-B</h3>
      <div className="mt-4 space-y-6 [&>p+ul]:-mt-4 text-base text-muted-foreground">
        <p>
          To fix the first problem, I wrapped the <code>motion.div</code> in a <code>div</code> as a grid cell slot.
          So the <code>div</code> will fill the empty position when the box is selected.
        </p>
        <p>
          To keep the size of the text in the box, I wrapped the text with <code>motion.span</code>
          , defined the <code>layout</code> attribute and same transition on it.
        </p>
      </div>
      <div className="relative grid grid-cols-2 mt-8 h-96 border-2 border-dashed border-blue-400 rounded-2xl p-2 gap-4">
        {boxesInfo.map((box) => (
          <div
            key={box.id}
            className="w-full h-full"
          >
            <motion.div
              key={box.id}
              layout
              transition={{ layout: { type: "spring", stiffness: 390, damping: 30 } }}
              className={cn(
                "w-full h-full flex items-center justify-center text-2xl",
                "border-2 border-dashed",
                box.color,
                "rounded-2xl",
                selectedBox === box.id && "absolute inset-0 m-auto w-[80%] h-[80%] z-5"
              )}
              onClick={() => {
                if (selectedBox === box.id) {
                  setSelectedBox(null)
                } else {
                  setSelectedBox(box.id)
                }
              }}
            >
              <motion.p
                layout
                transition={{ layout: { type: "spring", stiffness: 390, damping: 30 } }}
              >{box.id}</motion.p>
            </motion.div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-base text-muted-foreground">
        Now the layout animation is smooth and the text size is kept.
      </p>
      <hr className="w-full my-8" />


      <h3 className="font-bold mt-8">§ E1-C</h3>
      <div className="mt-4 space-y-6 [&>p+ul]:-mt-4 text-base text-muted-foreground">
        <p>
          Try to apply the layout animation to the image in the box.
        </p>
        <ul className="mt-2">
          <li>
            Use <code>motion.img</code> with local image url.
          </li>
          <li>
            Add a black blur mask as background when the box is selected.
          </li>
        </ul>
        <p>
          Some bugs:
        </p>
        <ul className="mt-2">
          <li>
            While image is exiting, the <code>zIndex</code> will jump to the default value, so the later picture will be on top.
          </li>
          <li>
            The background blur mask&apos;s exit animation is ignored, because it&apos;s DOM has been removed immediately.
          </li>
        </ul>
      </div>
      <div className="relative grid grid-cols-2 mt-8 h-96 p-2 gap-4">
        {boxesInfo.map((box) => (
          <div
            key={box.id}
            className="w-full h-full"
          >
            <motion.div
              key={box.id}
              layout
              transition={{
                layout: { type: "spring", stiffness: 390, damping: 30 },
                zIndex: { delay: selectedBox === box.id ? 0 : 0.5 }
              }}
              style={{ zIndex: selectedBox === box.id ? 5 : 0 }}
              className={cn(
                "w-full h-full flex items-center justify-center text-2xl",
                box.color,
                "rounded-2xl",
                selectedBox === box.id && "absolute inset-0 m-auto w-[80%] h-[80%]"
              )}
              onClick={() => {
                if (selectedBox === box.id) {
                  setSelectedBox(null)
                } else {
                  setSelectedBox(box.id)
                }
              }}
            >
              <div className="w-full h-full relative overflow-hidden rounded-2xl">
                <motion.img
                  layout
                  transition={{ layout: { type: "spring", stiffness: 390, damping: 30 } }}
                  src={box.image}
                  className={cn("absolute inset-0 m-auto object-cover")}
                ></motion.img>
              </div>
            </motion.div>
          </div>
        ))}
        {selectedBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBox(null)}
            className="absolute inset-0 z-3 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm rounded-2xl"
          >
          </motion.div>
        )}
      </div>
      <hr className="w-full my-8" />


      <h3 className="font-bold mt-8">§ E1-Summary</h3>
      <p className="mt-4 text-base text-muted-foreground">
        Layout Animation is suitable for the case:
      </p>
      <ul className="mt-2 text-base text-muted-foreground">
        <li>
          You need to animate <strong>one or a simple</strong> element.
        </li>
        <li>
          It is capable of animating the size or position change, such as sidebar toggle, card expansion, etc.
        </li>
      </ul>
    </div>
  )
}