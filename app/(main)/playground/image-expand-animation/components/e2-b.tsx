"use client"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PhotoQuery } from "@/drizzle/schema";

const photos = [
  { "id": "51ad9e09-3f2a-4d41-b45d-078e7fa52424", "title": "Daybreak", "creator": "Parrish", "description": "", "location": "", "capturedAt": "1922", "url": "https://neul1shzddwvm3wd.public.blob.vercel-storage.com/Daybreak_by_Parrish_%281922%29_%E9%BA%A6%E7%94%B0%E8%89%BA%E6%9C%AF%2Bnbfox.com-yNSWs5iepAhSNVBopevIHGdtOO5NXo.webp", "pathname": "Daybreak_by_Parrish_(1922)_麦田艺术+nbfox.com-yNSWs5iepAhSNVBopevIHGdtOO5NXo.webp", "contentType": "image/webp", "size": 1285162, "width": 3463, "height": 1999, "aspectRatio": "1.73", "isVertical": false, "md5": "44eda67c7fd313f6e3648cb888b7d11e", "blurbase64": "EwgKDIJCiHeGd5eweXegknYOtg==", "priority": 0, "createdAt": "2026-02-04 12:12:24.742052", "updatedAt": "2026-02-04 12:12:24.742052", "tags": ["b85f5c5f-5426-4987-89f4-d034b66e0530"] },
  { "id": "205d9e97-12b4-4980-a80c-aa0a2f14a9f7", "title": "The Siesta", "creator": "Vincent van Gogh", "description": "", "location": "", "capturedAt": "1890.1", "url": "https://neul1shzddwvm3wd.public.blob.vercel-storage.com/Vincent_van_Gogh_-_The_siesta_%28after_Millet%29_-_Google_Art_Project-zmXR9xTwStpp2BXLTbx1iPkvRMkjWz.webp", "pathname": "Vincent_van_Gogh_-_The_siesta_(after_Millet)_-_Google_Art_Project-zmXR9xTwStpp2BXLTbx1iPkvRMkjWz.webp", "contentType": "image/webp", "size": 1924412, "width": 3877, "height": 3056, "aspectRatio": "1.27", "isVertical": false, "md5": "f32dec05cf8cd54c9430d10cd62b1b45", "blurbase64": "YxkKHoJfh3eYd3hmeGh3l4eHsQADDGE=", "priority": 0, "createdAt": "2026-02-04 07:47:52.316342", "updatedAt": "2026-02-04 07:47:52.316342", "tags": ["b85f5c5f-5426-4987-89f4-d034b66e0530"] },
  { "id": "85aa2d1c-b77f-4732-890d-38b143b94c32", "title": "Haori", "creator": "Shimura Tatsumi", "description": null, "location": null, "capturedAt": "2011.04.29", "url": "https://neul1shzddwvm3wd.public.blob.vercel-storage.com/Shimura_Tatsumi-Two_Subjects_of_Japanese_Women-Haori-011135-04-29-2011-11135-x2000-7toa0KMqXWCtKuyjarbanBgb365kOt.webp", "pathname": "Shimura_Tatsumi-Two_Subjects_of_Japanese_Women-Haori-011135-04-29-2011-11135-x2000-7toa0KMqXWCtKuyjarbanBgb365kOt.webp", "contentType": "image/webp", "size": 342508, "width": 2000, "height": 1691, "aspectRatio": "1.18", "isVertical": false, "md5": "4835a592c0f245e9d04e7260d3874ef2", "blurbase64": "JxkGDoLbCHV1aWVXiFeXmGeZ/Iz6ntc=", "priority": 0, "createdAt": "2026-02-03 08:07:02.204788", "updatedAt": "2026-02-03 08:07:02.204788", "tags": ["b85f5c5f-5426-4987-89f4-d034b66e0530"] },
  { "id": "db1eb811-7fce-4352-aed0-4b9769ffc644", "title": "Highway", "creator": "Tianyu Yuan", "description": "", "location": "Munich, Germany", "capturedAt": "2023.10", "url": "https://neul1shzddwvm3wd.public.blob.vercel-storage.com/DSCF6995-isuP6e7z5g9yGQLQ3SycWOoOtDZI1G.webp", "pathname": "DSCF6995-isuP6e7z5g9yGQLQ3SycWOoOtDZI1G.webp", "contentType": "image/webp", "size": 1019076, "width": 6240, "height": 4160, "aspectRatio": "1.50", "isVertical": false, "md5": "e8d8d6ee0786fac86695cc20e0946a10", "blurbase64": "W9cJFYRjeHeMeHdfeOd5hpmAgQho", "priority": 0, "createdAt": "2026-01-31 04:22:50.072481", "updatedAt": "2026-01-31 04:22:50.072481", "tags": ["95b0cd2a-e7d3-41bc-b3b3-ca551cf43e96"] }
]

export function Experiment2B() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoQuery | null>(null)

  useEffect(() => {
    if (selectedPhoto) {
      const listener = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSelectedPhoto(null);
        }
      }
      addEventListener("keydown", listener);
      return () => {
        removeEventListener("keydown", listener);
      }
    }
  }, [selectedPhoto])


  // useEffect(() => {
  //   const {width, height} = useWindowSize();

  // })

  return (
    <>
      <h3 className="font-bold mt-8">§ E2-B Remote URL</h3>
      <div className="mt-8 text-sm text-muted-foreground space-y-4">

      </div>
      <div className="relative columns-1 sm:columns-2 gap-4 mt-8 border border-dashed border-gray-300 rounded-2xl p-4">
        {photos.map((photo) => (
          <div key={photo.id} className="w-full h-full">
            <motion.img
              layoutId={photo.id}
              src={photo.url}
              alt={photo.id}
              transition={{ layout: { type: "spring", stiffness: 350, damping: 30 } }}
              className={cn(
                "flex items-center justify-center text-2xl",
                "w-full h-full mb-4",
                "rounded-2xl select-none",
              )}
              onClick={() => setSelectedPhoto(photo)}
            ></motion.img>
          </div>
        ))}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 z-50 flex items-center justify-start bg-black/50 backdrop-blur-sm select-none"
            >
              <motion.img
                layoutId={selectedPhoto.id}
                transition={{ layout: { type: "spring", stiffness: 380, damping: 30 } }}
                src={selectedPhoto.url}
                alt={selectedPhoto.id}
                width={selectedPhoto.width}
                height={selectedPhoto.height}
                className={cn(
                  "object-cover ml-[10vw]",
                  "max-w-[60%] max-h-[90%] w-auto h-auto rounded-2xl select-none"
                )}
              />
              <motion.div
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
              {/* <div className="text-white ml-16 border-l border-white pl-8">
                <div className="text-2xl font-semibold"><b>{selectedPhoto.title}</b></div>
                <div className="mt-4">
                  <span className="font-bold text-sm">ARTIST</span><br/><i>{selectedPhoto.creator}</i>
                </div>
                {selectedPhoto.description && <div className="mt-4">{selectedPhoto.description}</div>}
                <div className="mt-4"><span className="font-bold text-sm">DATE</span><br/>{selectedPhoto.capturedAt}</div>
              </div> */}
              {/* <motion.div
                layoutId={selectedBox}
                // transition={{ layout: { type: "spring", stiffness: 380, damping: 30}}}
                className={cn("flex items-center justify-center",
                  "text-2xl max-w-[80%] max-h-[80%] rounded-2xl"
                )}
              >
                <Image
                  src={photos.find((photo) => photo.id === selectedBox)!.url}
                  alt={selectedBox}
                  width={photos.find((photo) => photo.id === selectedBox)!.width}
                  height={photos.find((photo) => photo.id === selectedBox)!.height}
                  className={cn(
                    "object-cover rounded-2xl"
                  )}
                />
              </motion.div> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}