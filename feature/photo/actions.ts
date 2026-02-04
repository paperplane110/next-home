"use server";

import { ActionReturn } from "@/lib/types";
import { db } from "@/lib/db";
import { type Photo, PhotoRegisterInput, photos, photoTags } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob"
import { protectAdmin } from "@/feature/auth/server";
import { getPhotoById, getPhotoByMd5, getPhotosService } from "./services";
import { updateTag } from "next/cache";

export async function checkImageDuplicateAction(
  md5: string
): Promise<ActionReturn<{
  isDuplicate: boolean;
  photo: Photo | null;
}>> {
  try {
    const existingPhoto = await getPhotoByMd5(md5);

    if (existingPhoto) {
      return {
        success: true,
        data: {
          isDuplicate: true,
          photo: existingPhoto,
        }
      }
    }
    else {
      return {
        success: true,
        data: {
          isDuplicate: false,
          photo: null,
        }
      }
    }
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to check image duplicate" };
  }
}

export async function insertOneImageAction(
  data: PhotoRegisterInput
): Promise<ActionReturn<Photo>> {
  try {
    await protectAdmin();
    const entry = await db.transaction(
      async (tx) => {
        // insert photos table
        const entries = await tx
          .insert(photos)
          .values(data)
          .returning()
        const photoId = entries[0].id;

        // insert photo_tags table
        if (data.tags && data.tags.length > 0) {
          const photoTagsEntries = data.tags.map((tagId) => {
            return {
              photoId,
              tagId,
            }
          })
          await tx.insert(photoTags).values(photoTagsEntries)
        }

        return entries[0]
      }
    )

    updateTag("photos");

    return { success: true, data: entry };
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to insert photo" };
  }
}

export async function getPhotosAction(
  offset: number,
  limit: number
): Promise<ActionReturn<Photo[]>> {
  try {
    const photoInfos = await getPhotosService(offset, limit);
    return { success: true, data: photoInfos };
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to get photos" };
  }
}

export async function deletePhotoAction(id: string): Promise<ActionReturn<null>> {
  try {
    await protectAdmin();

    // does photo exist
    const photo = await getPhotoById(id);
    if (!photo) {
      throw new Error(`Photo not found, id: ${id}`)
    }

    // delete photo info in neon
    await db.delete(photos).where(eq(photos.id, id));

    // delete blob after successful DB deletion
    await del(photo.pathname);

    // revalidate cache
    updateTag("photos");

    return { success: true, data: null };
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to delete photo" };
  }
}