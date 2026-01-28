"use server";

import { db } from "@/drizzle/db";
import { PhotoInsert, photos } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";


export async function checkImageDuplicate(md5: string) {
  const existingPhoto = await db
    .select()
    .from(photos)
    .where(eq(photos.md5, md5))
    .limit(1)
  if (existingPhoto.length > 0) {
    return {
      isDuplicate: true,
      photo: existingPhoto[0],
    }
  } else {
    return {
      isDuplicate: false,
      photo: null,
    }
  }
}

export async function insertOneImage(data: PhotoInsert) {
  try {
    const entry = await db
      .insert(photos)
      .values(data)
      .returning()
    return { message: "success", data: entry[0] };
  } catch (error) {
    return { message: "error", data: error };
  }
}

export async function getPhotos(offset: number, limit: number) {
  try {
    const photoInfos = await db
      .select()
      .from(photos)
      .offset(offset)
      .orderBy(desc(photos.createdAt))
      .limit(limit)
    return { message: "success", data: photoInfos };
  } catch (error) {
    return { message: "error", data: error };
  }
}