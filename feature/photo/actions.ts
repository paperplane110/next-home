"use server";

import { ActionReturn } from "@/lib/types";
import { db } from "@/lib/db";
import { type Photo, type PhotoInsert, photos } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob"
import { protectAdmin } from "@/feature/auth/server";
import { getPhotoById, getPhotoByMd5, getPhotosService } from "./services";
import { updateTag } from "next/cache";

export async function checkImageDuplicateAction(
  md5: string
): Promise<ActionReturn<{
  isDuplicate: boolean;
  photo: PhotoInsert | null;
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
  data: PhotoInsert
): Promise<ActionReturn<PhotoInsert>> {
  try {
    await protectAdmin();
    const entry = await db
      .insert(photos)
      .values(data)
      .returning()

    updateTag("photos");

    return { success: true, data: entry[0] };
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