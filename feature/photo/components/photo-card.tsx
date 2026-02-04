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

export function PhotoCard({ 
  photo, 
  index,
  handleDelete
}: { photo: PhotoQuery, index: number, handleDelete: (id: string) => void }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { data } =  authClient.useSession()
  const isAdmin = data?.user?.role === "admin";
  console.log(JSON.stringify(photo))
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: (index % 3) * 0.1 }} // 错开每一列的出现时间
          viewport={{ once: true }} // 只在第一次滑入时触发动画
          className={cn(
            "group relative overflow-hidden rounded-xl border bg-card",
            // photo.isVertical ? "md:row-span-2" : "md:col-span-2"
          )}
        >

          {photo.blurbase64 && <div
            className="absolute inset-0 z-0 scale-110 blur-2xl"
            style={{
              backgroundImage: `url(${base64ToDataURL(photo.blurbase64)})`,
              backgroundSize: 'cover',
              filter: 'blur(20px)',
              opacity: isLoaded ? 0 : 1, // 加载完成后隐藏背景
              transition: 'opacity 0.6s ease-in-out'
            }}
          />}

          <Image
            src={photo.url}
            alt={photo.title || "image"}
            className="w-full h-full object-cover"
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading={index < 6 ? "eager" : "lazy"}
            onLoad={() => setIsLoaded(true)}
            priority={index < 3}
            placeholder={photo.blurbase64 ? "blur" : "empty"}
            blurDataURL={photo.blurbase64 ? base64ToDataURL(photo.blurbase64) : undefined}
          />
          {/* <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2">
        {photo.location}
        <br />
        {photo.url}
      </div> */}
        </motion.div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem disabled={!isAdmin} variant="default" onClick={() => {}}>
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