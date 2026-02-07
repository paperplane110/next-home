"use client"

import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { photoAtom } from "@/lib/atoms";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { deletePhotoAction, getPhotosAction } from "@/feature/photo/actions";

import { PhotoCard } from "@/feature/photo/components/photo-card";
import { PhotoQuery } from "@/drizzle/schema";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { PhotoEditDialog } from "@/feature/photo/components/edit-dialog";
import { base64ToDataURL } from "@/lib/utils";


export function PhotoGallery({ initialPhotos }: { initialPhotos: PhotoQuery[] }) {
  useHydrateAtoms([[photoAtom, initialPhotos]]);
  const [photos, setPhotos] = useAtom(photoAtom);
  const [offset, setOffset] = useState(initialPhotos.length);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState<PhotoQuery | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (selectedPhoto) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSelectedPhoto(null);
        }
      }
      addEventListener("keydown", handleKeyDown);
      return () => {
        lenis?.start();
        document.body.style.overflow = "";
        removeEventListener("keydown", handleKeyDown);
      }
    }
  }, [selectedPhoto, lenis])

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
    } catch {
      toast.error("删除照片失败: 请稍后重试。");
      setPhotos(prevPhotos);
    }
  };

  return (
    <div className="space-y-12">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            handleDelete={handleDelete}
            onClick={() => setSelectedPhoto(photo)}
          />
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

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            transition={{ backgroundColor: { duration: 0.25 } }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div
              layoutId={selectedPhoto.id}
              transition={{ layout: { type: "spring", stiffness: 350, damping: 30 } }}
              className="relative flex max-h-[90vh] max-w-[90vw] rounded-lg items-center justify-center bg-card z-50 cursor-default"
              style={{
                willChange: "transform",
                backgroundImage: selectedPhoto.blurbase64 ? `url(${base64ToDataURL(selectedPhoto.blurbase64)})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                width={selectedPhoto.width}
                height={selectedPhoto.height}
                className="max-h-[90vh] w-auto object-contain rounded-lg"
                priority
                sizes="90vw"
                blurDataURL={selectedPhoto.blurbase64 ? base64ToDataURL(selectedPhoto.blurbase64) : undefined}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <PhotoEditDialog />
    </div>
  );
}