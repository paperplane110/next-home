"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PhotoQuery } from "@/drizzle/schema";
import Image from "next/image";
import { base64ToDataURL, cn } from "@/lib/utils";

import { authClient } from "@/feature/auth/client";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useEditPhotoId } from "@/hooks/use-query-state";

export function PhotoCard({
  photo,
  index,
  handleDelete,
  onClick
}: {
  photo: PhotoQuery,
  index: number,
  handleDelete: (id: string) => void,
  onClick?: () => void
}) {
  const [, setEditPhotoId] = useEditPhotoId();
  const [isAnimating, setIsAnimating] = useState(false);
  const { data } = authClient.useSession()
  const isAdmin = data?.user?.role === "admin";
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          layoutId={photo.id}
          onClick={onClick}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            opacity: { duration: 0.4, delay: (index % 3) * 0.1 },
            y: { duration: 0.4, delay: (index % 3) * 0.1 },
            layout: { duration: 0.2, ease: "easeInOut" }, // layout 动画不需要 delay
          }}
          viewport={{ once: true }} // 只在第一次滑入时触发动画
          onLayoutAnimationStart={() => setIsAnimating(true)}
          onLayoutAnimationComplete={() => setIsAnimating(false)}
          className={cn(
            "group relative overflow-hidden rounded-xl border bg-card mb-4 break-inside-avoid"
          )}
          style={{ zIndex: isAnimating ? 50 : 0, willChange: "transform" }} // 动画进行时 zIndex 提升
          whileHover={{ zIndex: 1 }} // hover 时 zIndex 提升 (可选)
        >

          {/* {photo.blurbase64 && <div
            className="absolute inset-0 z-0 scale-110"
            style={{
              backgroundImage: `url(${base64ToDataURL(photo.blurbase64)})`,
              backgroundSize: 'cover',
              opacity: isLoaded ? 0 : 1, // 加载完成后隐藏背景
              transition: 'opacity 0.6s ease-in-out'
            }}
          />} */}

          <Image
            src={photo.url}
            alt={photo.title || "image"}
            className="w-full h-auto object-cover"
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={index < 6 ? "eager" : "lazy"}
            priority={index < 3}
            placeholder={photo.blurbase64 ? "blur" : "empty"}
            blurDataURL={photo.blurbase64 ? base64ToDataURL(photo.blurbase64) : undefined}
          />
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem disabled={!isAdmin} variant="default" onClick={() => {
            setEditPhotoId(photo.id)
          }}>
            <SquarePenIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuItem disabled={!isAdmin} variant="destructive" onClick={() => handleDelete(photo.id)}>
            <TrashIcon />
            Delete
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}