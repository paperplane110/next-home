"use client"
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeftRightIcon } from "lucide-react";
import { useState } from "react"
const items = [
  { id: "1", color: "bg-orange-100 border-2 border-orange-400" },
  { id: "2", color: "bg-green-100 border-2 border-green-400" },
  { id: "3", color: "bg-purple-100 border-2 border-purple-400" },
  { id: "4", color: "bg-blue-100 border-2 border-blue-400" },
];

export function Experiment2C() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <h3 className="font-bold mt-16">§ What is AnimatePresence</h3>
      <div className="mt-8 space-y-6 [&>p+ol]:-mt-4 text-muted-foreground">
        <p>
          <code>AnimatePresence</code> will smoothly transition its animations when its direct child elements are removed from the DOM.
          Therefore, we can think of the layout animation process as follows:
        </p>
        <ol>
          <li><span className="text-blue-600 font-medium">Initial/End Layout</span>: the layout of the element when it is not selected</li>
          <li><span className="text-teal-600 font-medium">Selected Layout</span>: the layout of the element when it is selected</li>
          <li><span className="text-pink-600 font-medium">Link</span>: Use <code>LayoutId</code> tell framer-motion to link the element from initial/end layout and selected layout</li>
          <li>Enter Transition (0.5s): defined in the selected layout</li>
          <li>Exit Transition (1s): defined in the initial/end layout</li>
        </ol>
      </div>
      <div className="mt-8 flex flex-col items-center p-10">
        {/* 上方列表区域 */}
        <div className="relative">
          <div className="absolute top-[50%] left-0 translate-x-[-110%] text-right translate-y-[-50%] text-blue-600">
            <b>Initial/End Layout</b><br />
            Grid
          </div>
          <div className="relative grid grid-cols-2 gap-4 p-2 border-2 border-dashed border-blue-400 rounded-2xl w-full justify-center items-center">
            {items.map((item) => (
              <div key={item.id} className="relative w-20 h-20">
                {/* 只有未被选中时，才在此处显示 */}
                {selectedId !== item.id && (
                  <motion.div
                    layoutId={item.id} // 关键：共享 ID
                    onClick={() => setSelectedId(item.id)}
                    className={`${item.color} w-full h-full rounded-xl flex items-center justify-center cursor-pointer`}
                    transition={{ type: "spring", duration: 1 }}
                  >
                    <span className="text-gray-700 font-medium">{item.id}</span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Link */}
        <div className="h-20 relative text-pink-600">
          <ArrowLeftRightIcon className="size-6 absolute top-[50%] translate-x-[-50%] translate-y-[-50%] rotate-90" />
          <span className="font-medium absolute top-[50%] translate-x-4 translate-y-[-50%] w-max">SelectedId: {selectedId || "null"}</span>
        </div>

        <div className="relative">
          {/* 下方圆形目标区域 */}
          <div className="relative flex p-2 size-48 border-2 border-dashed border-teal-600 rounded-3xl justify-center items-center">
            {/* 背景辅助圆圈 */}
            <div className="size-40 rounded-full border-2 border-dashed border-teal-600 flex items-center justify-center">
              <span className="text-teal-600 font-medium">n</span>
            </div>

            {/* 选中的元素会“飞”到这里并变形 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="popLayout">
                {selectedId && (
                  <motion.div
                    key={selectedId}
                    layoutId={selectedId} // 关键：与上方 ID 对应
                    onClick={() => setSelectedId(null)}
                    className={cn(
                      items.find((i) => i.id === selectedId)?.color,
                      "size-40 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto"
                    )}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <span className="text-gray-700 font-medium">{selectedId}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="absolute top-[50%] left-0 translate-x-[-110%] translate-y-[-50%] text-right text-teal-600">
            <b>Selected Layout</b><br />
            AnimatePresence
          </div>
        </div>
      </div>
    </>
  );
}