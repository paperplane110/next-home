"use client"
import OuterLink from "@/components/link";
import { Card } from "@/components/ui/card";
import PhotoUploadForm from "@/feature/photo/components/upload-form";

export default function EverythingAboutFormsPage() {
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
          A image upload form, which allows users to upload images to the server.
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
    </div>
  )
}