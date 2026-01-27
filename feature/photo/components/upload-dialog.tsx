"use client"

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/feature/auth/client";
import PhotoUploadForm from "@/feature/photo/components/upload-form";
import { photoUploadDialogOpenAtom } from "@/lib/modal-store";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useAtom } from "jotai";

export function PhotoUploadDialog() {
  const [open, setOpen] = useAtom(photoUploadDialogOpenAtom);
  const { data } = authClient.useSession();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center">
            Upload Images
            {!data && <Badge className="ml-2 h-5 bg-green-600">Authenticating...</Badge>}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">Upload an image to gallery</DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar max-h-[60vh] overflow-y-auto">
          {
            !data ? (
              <div className="flex flex-col items-center justify-center gap-4 px-4">
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            ) : (
              <PhotoUploadForm onSuccess={() => setOpen(false)} />
            )
          }

        </div>
      </DialogContent>
    </Dialog>
  )
}
