"use client"
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/feature/auth/client";
import { useAtom } from "jotai";

import AccessDeniedCard from "@/components/access-denied-card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton";
import PhotoUploadForm from "@/feature/photo/components/upload-form";
import { photoUploadDialogOpenAtom } from "@/lib/modal-store";
import { DialogDescription } from "@radix-ui/react-dialog";

export function PhotoUploadDialog() {
  const [open, setOpen] = useAtom(photoUploadDialogOpenAtom);
  const { data, isPending, error, refetch } = authClient.useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (open && error?.message.includes("500")) {
      refetch();
    }
  }, [open, error, refetch]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center">
            Upload Images
            {isPending && <Badge className="ml-2 h-5 bg-green-600">Authenticating...</Badge>}
            {!isPending && !data && <Badge variant="destructive" className="ml-2 h-5">Access Denied</Badge>}
            {}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Upload an image to gallery.
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar max-h-[60vh] overflow-y-auto" data-lenis-prevent>
          {
            isPending ? (
              <div className="flex flex-col items-center justify-center gap-4 px-4">
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            ) : data ? (
              <PhotoUploadForm onSuccess={() => setOpen(false)} />
            ) : (
              <div className="flex flex-col w-full items-center gap-4">
                <AccessDeniedCard />
                <p className="text-muted-foreground text-sm">
                  Please <Link className="underline" href={`/auth/sign-in?redirectTo=${pathname}`} onClick={() => setOpen(false)}>login</Link> or contact the <Link className="underline" href="mailto:jyuan7155@gmail.com">lab admin</Link> for access.
                  {error?.message}
                </p>
              </div>
            )
          }

        </div>
      </DialogContent>
    </Dialog>
  )
}
