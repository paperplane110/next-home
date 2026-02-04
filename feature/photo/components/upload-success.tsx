import React from "react"
import { CheckCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadSuccessProps {
  onUploadAnother: () => void
  onClose: () => void
}

export default function UploadSuccess({ onUploadAnother, onClose }: UploadSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2Icon className="size-10" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Upload Successful!</h3>
      <p className="text-muted-foreground mb-8">
        Your photo has been added to the gallery.
      </p>
      <div className="flex flex-col w-full gap-3">
        <Button
          onClick={onUploadAnother}
          variant="default"
          className="w-full"
        >
          Upload Another
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full"
        >
          Close
        </Button>
      </div>
    </div>
  )
}
