"use client";

import { TriangleAlert } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmLoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ConfirmLoadDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmLoadDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm" className="overflow-hidden p-0 text-center">
        <AlertDialogHeader className="items-center px-6 pt-4 text-center">
          <AlertDialogMedia className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600">
            <TriangleAlert className="size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>继续加载？</AlertDialogTitle>
          <AlertDialogDescription>
            当前有未保存改动。<br />
            加载本地文件后，将覆盖当前内容。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-stone-100 px-4 py-3">
          <AlertDialogCancel size="sm">取消</AlertDialogCancel>
          <AlertDialogAction
            size="sm"
            className="bg-red-100 text-sm text-red-600 hover:bg-red-200"
            onClick={onConfirm}
          >
            继续加载
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

