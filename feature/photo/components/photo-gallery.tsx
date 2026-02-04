"use client"

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { deletePhotoAction, getPhotosAction } from "@/feature/photo/actions";
import { PhotoCard } from "@/feature/photo/components/photo-card";
import { PhotoQuery } from "@/drizzle/schema";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export function PhotoGallery({ initialPhotos }: { initialPhotos: PhotoQuery[] }) {
  const [photos, setPhotos] = useState<PhotoQuery[]>(initialPhotos);
  const [offset, setOffset] = useState(initialPhotos.length);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 创建触发器的引用
  const scrollTriggerRef = useRef(null);
  // 2. 预加载策略：当触发器进入视口 400px (margin) 时就开始加载，减少用户等待感
  const isInView = useInView(scrollTriggerRef, { margin: "0px 0px 400px 0px" });

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      const loadNextPage = async () => {
        setIsLoading(true);
        const limit = 10;
        const { success, data: photoInfos } = await getPhotosAction(offset, limit);

        if (success) {
          if (photoInfos.length < limit) {
            setHasMore(false);
          }
          setPhotos((prev) => [...prev, ...photoInfos]);
          setOffset((prev) => prev + photoInfos.length);
        } else {
          toast.error("获取照片失败，请稍后重试。");
        }

        setIsLoading(false);
      };

      loadNextPage();
    }
  }, [isInView, hasMore, isLoading, offset]);

  const handleDelete = async (id: string) => {
    const prevPhotos = [...photos]
    setPhotos(prevPhotos.filter((p) => p.id !== id))
    try {
      const response = await deletePhotoAction(id);

      if (response?.success) {
        // 刷新页面或更新状态以删除照片
        toast.success("删除照片成功");
      } else {
        toast.error("删除照片失败");
        setPhotos(prevPhotos);
      }
    } catch (error) {
      toast.error("删除照片失败: 请稍后重试。");
      setPhotos(prevPhotos);
    }
  };

  return (
    <div className="space-y-12">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {photos.map((photo, index) => (
          <PhotoCard key={photo.id} photo={photo} index={index} handleDelete={handleDelete} />
        ))}
      </div>

      {/* 触发器元素 */}
      <div ref={scrollTriggerRef} className="h-20 w-full flex justify-center items-center">
        {isLoading && (
           <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
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