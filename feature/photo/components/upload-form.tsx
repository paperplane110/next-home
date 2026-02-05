"use client"


import { useEffect, useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { parseImage } from "@/feature/photo/image-parser"
import { base64ToDataURL, cn } from "@/lib/utils"
import imageCompression from "browser-image-compression"
import { upload } from "@vercel/blob/client"
import { checkImageDuplicateAction, insertOneImageAction } from "@/feature/photo/actions"
import { photoUploadFormSchema, type PhotoUploadForm as PhotoUploadFormType, PhotoInsert } from "@/drizzle/schema"
import { getTagsAction } from "@/feature/tag/actions"
import { useFileUpload } from "@/hooks/use-file-upload"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { CircleXIcon, Loader2Icon, UploadIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "@/components/ui/multi-select"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"
import UploadSuccess from "./upload-success"


export default function PhotoUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isParsingImg, setIsParsingImg] = useState(false) // 是否正在解析图片信息
  const [duplicatePhoto, setDuplicatePhoto] = useState<PhotoInsert | null>(null)
  const [isChecking, setIsChecking] = useState(false)     // 是否在检查图片是否重复

  const [fileUploadState, fileUploadActions] = useFileUpload({
    maxFiles: 1,
    accept: "image/*",
    multiple: false,
    onFilesAdded: async (files) => {
      const fileWithPreview = files[0]
      const file = fileWithPreview.file;

      if (file instanceof File) {
        form.setValue("imgFile", file, { shouldValidate: true })
        setIsParsingImg(true)
        try {
          // parse image info
          const imageInfo = await parseImage(file)
          setIsParsingImg(false)

          // checking duplicate image
          setIsChecking(true)
          setImageShapeInfo(imageInfo)
          const checkResult = await checkImageDuplicateAction(imageInfo.md5)
          if (checkResult.success) {
            const { isDuplicate, photo } = checkResult.data
            if (isDuplicate) {
              setDuplicatePhoto(photo)
            } else {
              setDuplicatePhoto(null)
            }
          } else {
            throw new Error(checkResult.data)
          }
          setIsChecking(false)

        } catch (error) {
          console.error("Error parsing image:", error)
          toast.error("解析图片失败: 请稍后重试。")
        } finally {
          setIsParsingImg(false);
          setIsChecking(false)
        }
      }
    }
  })

  const [tagOptions, setTagOptions] = useState<{ value: string, label: string }[]>([])
  const [isLoadingTag, setIsLoadingTag] = useState(true)
  useEffect(() => {
    getTagsAction().then(tags => {
      setTagOptions(tags.map(tag => ({ value: tag.id, label: tag.name })))
      setIsLoadingTag(false)
    }).catch(error => {
      console.error("Error fetching tags:", error)
      toast.error("加载标签失败: 请稍后重试。")
      setIsLoadingTag(false)
    })
  }, [])

  const [isUploading, setIsUploading] = useState(false)   // 是否正在上传图片
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)       // 是否上传成功

  const defaultImageShapeInfo = {
    width: 0,
    height: 0,
    aspectRatio: "0",
    isVertical: false,
    blurbase64: "",
    md5: "",
  }
  const [imageShapeInfo, setImageShapeInfo] = useState(defaultImageShapeInfo)

  const form = useForm<PhotoUploadFormType>({
    resolver: zodResolver(photoUploadFormSchema),
    defaultValues: {
      title: "",
      capturedAt: "",
      description: "",
      creator: "Tianyu",
      tags: [],
      location: "",
      imgFile: undefined,
    }
  })

  const handleImageRemove = () => {
    fileUploadActions.clearFiles()
    setDuplicatePhoto(null)
    setImageShapeInfo(defaultImageShapeInfo)
    setUploadProgress(0)
    form.reset()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = async (data: PhotoUploadFormType) => {
    // 1. set isUploading to true
    setIsUploading(true)

    try {
      // 2. compress image 1 MB
      const compressFile = await imageCompression(data.imgFile, {
        maxSizeMB: 2,
        maxWidthOrHeight: 3840,
        initialQuality: 0.88,
        fileType: "image/webp",
        useWebWorker: true,
      })
      const webpName = data.imgFile.name.replace(/\.[^/.]+$/, "") + ".webp"

      // 3. upload image to vercel blob
      const newBlob = await upload(webpName, compressFile, {
        access: "public",
        handleUploadUrl: "/api/photo/upload",
        onUploadProgress: (progress) => {
          console.log("Upload progress:", progress.percentage)
          setUploadProgress(progress.percentage)
        },
      })

      // filter out imgFile, because imgFile is MB, too large for Nextjs backend
      const { imgFile, ...metadata } = data;
      void imgFile;
      // 4. insert photo info to db
      const insertResult = await insertOneImageAction({
        ...imageShapeInfo,
        ...metadata,
        url: newBlob.url,
        pathname: newBlob.pathname,
        contentType: newBlob.contentType,
        size: compressFile.size,
      })

      if (insertResult.success) {
        setIsSuccess(true)
      } else {
        throw new Error(insertResult.data)
      }
    } catch (error) {
      toast.error("Failed to upload image, please try again.")
      console.error("Error uploading image:", error)
    }
    setIsUploading(false)
    setUploadProgress(0)
  }

  // 4. check if submit is disabled
  const isSubmitDisabled = isChecking || isParsingImg || !!duplicatePhoto || isUploading

  if (isSuccess) {
    return (
      <UploadSuccess
        onUploadAnother={() => {
          handleImageRemove()
          setIsSuccess(false)
        }}
        onClose={onSuccess}
      />
    )
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-4 px-4">
            <FormField
              control={form.control}
              name="imgFile"
              render={({ fieldState }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex flex-col items-center gap-4"
                      onDragEnter={fileUploadActions.handleDragEnter}
                      onDragOver={fileUploadActions.handleDragOver}
                      onDragLeave={fileUploadActions.handleDragLeave}
                      onDrop={fileUploadActions.handleDrop}
                    >
                      <input
                        {...fileUploadActions.getInputProps({
                          id: "picture-upload",
                          className: "hidden",
                        })}
                      />
                      {!fileUploadState.files[0]?.preview ? (
                        <Label
                          htmlFor="picture-upload"
                          className={cn(
                            "group p-4 w-full flex flex-col items-center justify-center border border-dashed rounded-md cursor-pointer text-muted-foreground transition-colors",
                            fieldState.error ? "border-destructive bg-destructive/5 text-destructive" : "hover:border-primary",
                            fileUploadState.isDragging && "border-primary"
                          )}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center justify-center size-10 bg-muted rounded-full">
                              <UploadIcon className={cn("size-5 group-hover:text-primary", 
                                fileUploadState.isDragging && "text-primary")} />
                            </div>
                            <div className="text-lg text-black">Upload Image</div>
                            <div className="text-sm">Drag and drop files here or click to browse</div>
                          </div>
                        </Label>
                      ) : (
                        <div id="image-preview" className="relative group flex items-center justify-center">

                          {isChecking && (
                            <div id="image-preview-mask" className={cn(
                              "absolute top-0 right-0 bottom-0 left-0 bg-black/50 rounded-md text-white px-1 rounded-bl-md flex flex-col items-center justify-center opacity-100"
                            )}
                            >
                              <Loader2Icon className="size-4 animate-spin" />
                            </div>
                          )}

                          <div id="image-preview-mask" className={cn(
                            "absolute top-0 right-0 bottom-0 left-0 rounded-md text-white px-1 rounded-bl-md flex flex-col items-center justify-center gap-2",
                            "transition-opacity duration-200 opacity-0 group-hover:opacity-100",
                            duplicatePhoto && "opacity-100"
                          )}
                            style={{
                              backgroundImage: `url(${base64ToDataURL(imageShapeInfo.blurbase64)})`,
                              backgroundSize: 'cover',
                            }}
                          >
                            <Button size="sm" variant="destructive" className="cursor-pointer" onClick={handleImageRemove}>
                              <CircleXIcon className="size-4" />
                              {duplicatePhoto ? "Duplicated Image" : "Remove"}
                            </Button>
                          </div>
                          <img src={fileUploadState.files[0].preview} alt="Preview" className="max-h-64 rounded-lg object-contain" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-center text-xs" />
                </FormItem>
              )}
            />

            {duplicatePhoto && (
              <div id="duplicate-info" className="w-full bg-destructive/5 p-4 rounded-md">
                <h3 className="text-sm font-medium text-destructive">Find Duplicate Image</h3>
                <p className="mt-2 text-xs text-destructive wrap-anywhere">This image is a duplicate of {duplicatePhoto.url}</p>
              </div>
            )}
            {fileUploadState.files[0]?.preview && (
              <div id="image-info" className="w-full bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium">Image Information</h3>
                <ul className="mt-2 list-disc marker:text-muted-foreground text-xs text-muted-foreground">
                  <li>Name: {form.getValues("imgFile")?.name}</li>
                  <li>Width / Height: {imageShapeInfo.width} / {imageShapeInfo.height}</li>
                  <li>Aspect Ratio: {imageShapeInfo.aspectRatio}</li>
                  <li>Is Vertical: {imageShapeInfo.isVertical ? "Yes" : "No"}</li>
                  <li>Blurbase64: {imageShapeInfo.blurbase64}</li>
                  <li>MD5: {imageShapeInfo.md5}</li>
                </ul>
              </div>
            )}
          </div>

          <div id="image-meta" className="mt-4 flex flex-col gap-4 px-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      name={field.name}
                      ref={field.ref}
                      value={field.value ?? ''}
                      placeholder="e.g. My Beautiful Photo"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capturedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Captured At</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2026.01" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="creator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creator<Badge variant="outline" className="text-xs bg-gray-100 border-none">Optional</Badge></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags<Badge variant="outline" className="text-xs bg-gray-100 border-none">Optional</Badge></FormLabel>
                  <FormControl>
                    {isLoadingTag ? (
                      <Skeleton className="w-full h-10" />
                    ) : (
                      <MultiSelect
                        value={field.value}
                        disabled={field.disabled}
                        name={field.name}
                        ref={field.ref}
                        options={tagOptions}
                        onValueChange={field.onChange}
                        placeholder="e.g. nature, sunset"
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location<Badge variant="outline" className="text-xs bg-gray-100 border-none">Optional</Badge></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description<Badge variant="outline" className="text-xs bg-gray-100 border-none">Optional</Badge></FormLabel>
                  <FormControl>
                    <Input
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      name={field.name}
                      ref={field.ref}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-8 px-4">
            <Button
              disabled={isSubmitDisabled}
              type="submit"
              className={cn("w-full")}
            >
              {!isSubmitDisabled && "Upload"}
              {isUploading && (
                <p>
                  Uploading {uploadProgress.toFixed(0)}%
                </p>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
