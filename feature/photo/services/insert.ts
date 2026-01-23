import { db } from "@/drizzle/db"
import { photos, type PhotoUploadForm } from "@/drizzle/schema"
import { PutBlobResult } from "@vercel/blob"

type ImageShapeInfo = {
  width: number
  height: number
  aspectRatio: string
  isVertical: boolean
  blurhash: string
  md5: string
}

export default async function insertOnePhoto({
  imgFile,
  imgShapeInfo,
  formData,
  blob
}: {
  imgFile: File
  imgShapeInfo: ImageShapeInfo
  formData: PhotoUploadForm
  blob: PutBlobResult
}) {
  try {
    // insert info to db
    const entry = {
      ...formData,
      ...imgShapeInfo,
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: imgFile.size,
    }
    await db.insert(photos).values(entry)
    return { message: "success", data: entry };
  } catch (error) {
    return { message: "error", data: error };
  }
}