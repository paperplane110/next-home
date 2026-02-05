"use server";

import { ActionReturn } from "@/lib/types";
import { db } from "@/lib/db";
import { type Photo, PhotoEditForm, type PhotoRegisterInput, photos, photoTags } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { del } from "@vercel/blob"
import { protectAdmin } from "@/feature/auth/server";
import { type PhotoQuery, getPhotoById, getPhotoByMd5, getPhotosService } from "./services";
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
): Promise<ActionReturn<PhotoQuery>> {
  try {
    await protectAdmin();
    const entry = await db.transaction(
      async (tx) => {
        // insert photos table
        const { tags, ...photoData } = data;
        const entries = await tx
          .insert(photos)
          .values(photoData)
          .returning()
        const photoId = entries[0].id;

        // insert photo_tags table
        if (tags && tags.length > 0) {
          const photoTagsEntries = tags.map((tagId) => {
            return {
              photoId,
              tagId,
            }
          })
          await tx.insert(photoTags).values(photoTagsEntries)
        }

        return {
          ...entries[0],
          tags: tags ?? [],
        }
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
): Promise<ActionReturn<PhotoQuery[]>> {
  try {
    const photoInfos = await getPhotosService(offset, limit);
    return { success: true, data: photoInfos };
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to get photos" };
  }
}

export async function deletePhotoAction(id: string): Promise<ActionReturn<PhotoQuery>> {
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

    return { success: true, data: photo };
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to delete photo" };
  }
}

export async function updatePhotoAction(
  id: string,
  data: PhotoEditForm
): Promise<ActionReturn<PhotoQuery>> {
  try {
    await protectAdmin();

    // does photo exist
    const photo = await getPhotoById(id);
    if (!photo) {
      throw new Error(`Photo not found, id: ${id}`)
    }

    const result = await db.transaction(async (tx) => {
      // update photo info in neon
      const {tags: newTags, ...photoData} = data;
      const entry = await tx.update(photos)
        .set(photoData)
        .where(eq(photos.id, id))
        .returning()
      
      // update photoTags
      if (newTags) {
        const oldTags = photo.tags;
        const tagToCreate = newTags.filter((tagId) => !oldTags.includes(tagId));
        const tagToDelete = oldTags.filter((tagId) => !newTags.includes(tagId));
        // delete photo_tags
        await tx.delete(photoTags).where(and(eq(photoTags.photoId, id), inArray(photoTags.tagId, tagToDelete)));
        // create photo_tags
        if (tagToCreate.length > 0) {
          const photoTagsEntries = tagToCreate.map((tagId) => {
            return {
              photoId: id,
              tagId,
            }
          })
          await tx.insert(photoTags).values(photoTagsEntries)
        }
      }

      return {...entry[0], tags: newTags ?? []};
    })

    // revalidate cache
    updateTag("photos");

    return { success: true, data: result };
  } catch (e) {
    console.error(e)
    return { success: false, data: "Failed to update photo" };
  }
}
