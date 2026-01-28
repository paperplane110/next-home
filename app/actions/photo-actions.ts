"use server";

import { ActionReturn } from "@/lib/types";
import { db } from "@/drizzle/db";
import { PhotoInsert, photos } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";


export async function checkImageDuplicate(
  md5: string
): Promise<ActionReturn<{
  isDuplicate: boolean;
  photo: PhotoInsert | null;
}>> {
  try {
    const existingPhoto = await db
      .select()
      .from(photos)
      .where(eq(photos.md5, md5))
      .limit(1)

    if (existingPhoto.length > 0) {
      return {
        success: true,
        data: {
          isDuplicate: true,
          photo: existingPhoto[0],
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

export async function insertOneImage(
  data: PhotoInsert
): Promise<ActionReturn<PhotoInsert>> {
  try {
    const entry = await db
      .insert(photos)
      .values(data)
      .returning()
    return { success: true, data: entry[0] };
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to insert photo" };
  }
}

export async function getPhotos(
  offset: number,
  limit: number
): Promise<ActionReturn<PhotoInsert[]>> {
  try {
    const photoInfos = await db
      .select()
      .from(photos)
      .offset(offset)
      .orderBy(desc(photos.createdAt))
      .limit(limit)
    return { success: true, data: photoInfos };
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to get photos" };
  }
}