"use client"

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { getPhotos } from "@/app/actions/photo-actions";
import { PhotoCard } from "@/components/photo-card";
import { Photo } from "@/drizzle/schema";

export function PhotoGallery({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [offset, setOffset] = useState(initialPhotos.length);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 创建触发器的引用
  const scrollTriggerRef = useRef(null);
  // 2. 预加载策略：当触发器进入视口 100px (margin) 时就开始加载，减少用户等待感
  const isInView = useInView(scrollTriggerRef, { margin: "0px 0px 400px 0px" });

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      const loadNextPage = async () => {
        setIsLoading(true);
        const limit = 12;
        const { data: photoInfos } = await getPhotos(offset, limit);

        if (photoInfos.length < limit) {
          setHasMore(false);
        }

        setPhotos((prev) => [...prev, ...photoInfos]);
        setOffset((prev) => prev + photoInfos.length);
        setIsLoading(false);
      };

      loadNextPage();
    }
  }, [isInView, hasMore, isLoading, offset]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <PhotoCard key={photo.id} photo={photo} index={index} />
        ))}
      </div>

      {/* 触发器元素 */}
      <div ref={scrollTriggerRef} className="h-20 w-full flex justify-center items-center">
        {isLoading && (
           <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
        {!hasMore && (
          <span className="text-muted-foreground text-sm italic">
            已经翻到山脚下了，没有更多照片了
          </span>
        )}
      </div>
    </div>
  );
}