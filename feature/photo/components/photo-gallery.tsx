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

  const maxWidthConstraint = "70vw"
  const maxHeightConstraint = "90vh"

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
    <div className="space-y-12 mx-2">
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
              key="backdrop"
              initial={{
                backgroundColor: "rgba(0, 0, 0, 0)",
                backdropFilter: "blur(0px)"
              }}
              animate={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)"
              }}
              exit={{
                backgroundColor: "rgba(0, 0, 0, 0)",
                backdropFilter: "blur(0px)"
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 z-50 flex items-center justify-start bg-black/50 backdrop-blur-sm select-none"
            >
              <motion.div
                layoutId={selectedPhoto.id}
                transition={{ layout: { type: "spring", stiffness: 380, damping: 40 } }}
                className="relative flex items-center justify-center z-50 cursor-default"
              >
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  width={selectedPhoto.width}
                  height={selectedPhoto.height}
                  className="ml-10 object-contain rounded-xl"
                  style={{
                    // 宽度 = 取 (宽度上限) 和 (基于高度上限算出的宽度) 中的最小值
                    width: `min(${maxWidthConstraint}, calc(${maxHeightConstraint} * ${selectedPhoto.aspectRatio}))`,
                    // 高度 = 取 (高度上限) 和 (基于宽度上限算出的高度) 中的最小值
                    height: `min(${maxHeightConstraint}, calc(${maxWidthConstraint} / ${selectedPhoto.aspectRatio}))`,
                  }}
                  priority
                  sizes="70vw"
                  placeholder="blur"
                  blurDataURL={selectedPhoto.blurbase64 ? base64ToDataURL(selectedPhoto.blurbase64) : undefined}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, translateX: "50%" }}
                animate={{ opacity: 1, translateX: "0", transition: { duration: 0.3, ease: "easeInOut" } }}
                exit={{ opacity: 0, translateX: "30%", transition: { duration: 0.1, ease: "easeInOut" } }}
                className="text-white ml-16 border-l border-white pl-8"
              >
                <div className="text-2xl font-medium"><b>{selectedPhoto.title}</b></div>
                <div className="mt-4">
                  <i>{!selectedPhoto.creator?.includes("Tianyu") && selectedPhoto.creator}</i>
                  {selectedPhoto.location && <div>{selectedPhoto.location}</div>}
                  {selectedPhoto.description && <div className="mt-4">{selectedPhoto.description}</div>}
                  <div>{selectedPhoto.capturedAt}</div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      <PhotoEditDialog />
    </div>
  );
}