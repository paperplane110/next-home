"use client"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
const items = [
  { id: "4-1", color: "bg-orange-100 border-2 border-orange-400" },
  { id: "4-2", color: "bg-green-100 border-2 border-green-400" },
  { id: "4-3", color: "bg-purple-100 border-2 border-purple-400" },
  { id: "4-4", color: "bg-blue-100 border-2 border-blue-400" },
];

export function Experiment4() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <h3 className="font-bold mt-16">§ E4</h3>
      <div className="flex flex-col items-center gap-20 p-10">
        {/* 上方列表区域 */}
        <div className="relative flex gap-4 p-2 border-2 border-dashed border-blue-400 rounded-2xl w-full justify-center items-center">
          {items.map((item) => (
            <div key={item.id} className="relative w-20 h-20">
              {/* 只有未被选中时，才在此处显示 */}
              {selectedId !== item.id && (
                <motion.div
                  layoutId={item.id} // 关键：共享 ID
                  onClick={() => setSelectedId(item.id)}
                  className={`${item.color} w-full h-full rounded-xl flex items-center justify-center cursor-pointer`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <span className="text-gray-700 font-medium">{item.id}</span>
                </motion.div>
              )}
            </div>
          ))}
          <div className="absolute top-[50%] left-5 translate-y-[-50%] text-blue-600">Grid</div>
        </div>

        {/* 下方圆形目标区域 */}
        <div className="relative flex p-2 border-2 border-dashed border-green-400 rounded-3xl w-full justify-center items-center">
          {/* 背景辅助圆圈 */}
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400" />

          {/* 选中的元素会“飞”到这里并变形 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="popLayout">
              {selectedId && (
                <motion.div
                  key={selectedId}
                  layoutId={selectedId} // 关键：与上方 ID 对应
                  onClick={() => setSelectedId(null)}
                  className={`${items.find((i) => i.id === selectedId)?.color
                    } size-20 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <span className="text-gray-700 font-medium">{selectedId}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="absolute top-[50%] left-5 translate-y-[-50%] text-green-600">AnimatePresence</div>
        </div>
      </div>
    </>
  );
}