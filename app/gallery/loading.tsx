import { cn } from "@/lib/utils"; // 假设你有一个合并 className 的工具函数

export default function GalleryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 标题骨架 */}
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-8" />

      {/* 图片网格骨架 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 9 }).map((_, index) => ( // 假设你的第一屏会显示9张图
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}

// 可复用的骨架卡片组件
function SkeletonCard() {
  return (
    <div
      className={cn(
        "relative aspect-square w-full rounded-lg overflow-hidden",
        "bg-gray-100 dark:bg-gray-800",
        "animate-pulse", // 使用 tailwindcss 的 animate-pulse
        "flex flex-col justify-end p-4"
      )}
    >
      {/* 图像区域骨架 */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-60" />

      {/* 底部信息骨架 */}
      <div className="relative z-10 space-y-2">
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-md" />
        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md" />
      </div>
    </div>
  );
}