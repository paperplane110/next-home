"use client"
import OuterLink from "@/components/link";
import { Card } from "@/components/ui/card";
import { EditImageForm } from "@/feature/photo/components/edit-form";
import PhotoUploadForm from "@/feature/photo/components/upload-form";

export default function EverythingAboutFormsPage() {
  const editPhoto = {
    "id": "85aa2d1c-b77f-4732-890d-38b143b94c32",
    "title": "Haori",
    "creator": "Shimura Tatsumi",
    "description": null,
    "location": null,
    "capturedAt": "2011.04.29",
    "url": "https://neul1shzddwvm3wd.public.blob.vercel-storage.com/Shimura_Tatsumi-Two_Subjects_of_Japanese_Women-Haori-011135-04-29-2011-11135-x2000-7toa0KMqXWCtKuyjarbanBgb365kOt.webp",
    "pathname": "Shimura_Tatsumi-Two_Subjects_of_Japanese_Women-Haori-011135-04-29-2011-11135-x2000-7toa0KMqXWCtKuyjarbanBgb365kOt.webp",
    "contentType": "image/webp",
    "size": 342508, "width": 2000, "height": 1691, "aspectRatio": "1.18", "isVertical": false,
    "md5": "4835a592c0f245e9d04e7260d3874ef2",
    "blurbase64": "JxkGDoLbCHV1aWVXiFeXmGeZ/Iz6ntc=",
    "priority": 0,
    "createdAt": "2026-02-03T08:07:02.204Z", "updatedAt": "2026-02-03T08:07:02.204Z",
    "tags":["b85f5c5f-5426-4987-89f4-d034b66e0530"]
  }
  return (
    <div className="page-top-margin sm:pb-8 section">
      <header className="subsection">
        <h1 className="headline font-serif font-light soft-70">Everything About Forms</h1>
        <p className="mt-8 text-sm font-medium text-muted-foreground">
          这是一个关于表单的页面，展示了不同类型的表单组件和使用方法。
        </p>

      </header>

      <div className="subsection mt-16">
        <h2 className="font-bold">Upload Image Form</h2>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          An image upload form, which allows users to upload images to the server.
        </p>
        <ul className="mt-4 list-disc list-inside text-sm text-muted-foreground">
          <li>Image upload: referenced the ReUI&apos;s <OuterLink href="https://reui.io/docs/file-upload">File upload</OuterLink> component</li>
          <li>Image compression: <OuterLink href="https://www.npmjs.com/package/browser-image-compression">browser-image-compression</OuterLink></li>
          <li>Image blur hash: evanw&apos;s <OuterLink href="https://github.com/evanw/thumbhash">thumbhash</OuterLink></li>
          <li>Tags multi-select: based on sersavan&apos;s <OuterLink href="https://github.com/sersavan/shadcn-multi-select-component">Multi-select</OuterLink> component</li>
        </ul>
        <Card className="mt-8">
          <PhotoUploadForm onSuccess={() => { }} />
        </Card>
      </div>
      <div className="subsection mt-16">
        <h2 className="font-bold">Edit Image Form</h2>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          An image edit form, which allows users to edit the image&apos;s title, description, tags, etc.
        </p>
        <Card className="mt-8">
          <EditImageForm photo={editPhoto} />
        </Card>
      </div>
    </div>
  )
}