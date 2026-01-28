import { motion } from "framer-motion";
import { Photo } from "@/drizzle/schema";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { vercelBlobLoader } from "@/feature/photo/vercel-blob-loader";

export function PhotoCard({ photo, index }: { photo: Photo, index: number }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.1 }} // 错开每一列的出现时间
      viewport={{ once: true }} // 只在第一次滑入时触发动画
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card",
        !photo.isVertical && "md:col-span-2"
      )}
    >
      <Image
        loader={vercelBlobLoader}
        src={photo.url}
        alt={photo.title || "image"}
        className="w-full h-full object-cover"
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading={index < 6 ? "eager" : "lazy"}
        priority={index < 3}
        placeholder="empty"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2">
        {photo.location}
        <br />
        {photo.url}
      </div>
    </motion.div>
  );
}