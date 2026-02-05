"use client"
import { type PhotoQuery } from "@/drizzle/schema"
import { useAtom } from "jotai"
import { photoAtom } from "@/lib/atoms"
import { useEditPhotoId } from "@/hooks/use-query-state"

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import { EditImageForm } from "@/feature/photo/components/edit-form"
import { useMemo } from "react"

export function PhotoEditDialog() {
  const [editPhotoId, setEditPhotoId] = useEditPhotoId();
  const [photos, setPhotos] = useAtom(photoAtom);
  const photo = useMemo(() => photos.find((p) => p.id === editPhotoId), [photos, editPhotoId]);

  const onSuccess = (updatedPhoto: PhotoQuery) => {
    setPhotos((prev) => prev.map((p) => p.id === updatedPhoto.id ? updatedPhoto : p))
  }

  return (
    <Dialog
      open={!!editPhotoId}
      onOpenChange={(open) => setEditPhotoId(open ? editPhotoId : "")}
    >
      <DialogContent data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Edit Photo</DialogTitle>
          <DialogDescription>
            Edit the details of the photo.
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar max-h-[60vh] overflow-y-auto">
          {photo ? (
            <EditImageForm
              photo={photo}
              onSuccess={onSuccess}
            />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-xl font-medium">Image Not Found or Invalid ID</h2>
              <p className="mt-4 text-muted-foreground text-sm">Image ID: {editPhotoId}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

