/**
 * Photo service, especially for query photo info
 */

import { db } from "@/lib/db";
import { photos } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// 获取照片列表（带分页和缓存）
export const getPhotosService = (offset: number, limit: number) =>
  unstable_cache(
    async () => {
      const photosWithRawTags = await db.query.photos.findMany({
        offset,
        limit,
        with: {
          photoTags: {
            with: {
              tag: true
            }
          }
        },
        orderBy: (photos, { desc }) => [desc(photos.createdAt)],
      })
      // seperate photoTags，and convert it to tags
      return photosWithRawTags.map(({photoTags, ...data}) => ({
        ...data,
        tags: photoTags.map((tag) => tag.tagId),
      }))
    },
    ["photos-list", `offset-${offset}`, `limit-${limit}`],
    { tags: ["photos"] }
  )();

// 检查 MD5 重复（不建议缓存，因为需要实时准确性）
export async function getPhotoByMd5(md5: string) {
  const result = await db
    .select()
    .from(photos)
    .where(eq(photos.md5, md5))
    .limit(1);
  return result[0] || null;
}

// 根据 ID 获取单张照片信息（不建议缓存，因为需要实时准确性）
export async function getPhotoById(id: string) {
  const result = await db.query.photos.findFirst({
    where: eq(photos.id, id),
    with: {
      photoTags: {
        with: {
          tag: true
        }
      }
    },
  })
  if (result) {
    // seperate photoTags，and convert it to tags
    const { photoTags, ...data } = {
      ...result,
      tags: result.photoTags.map((tag) => tag.tagId),
    }
    void photoTags
    return data
  } else {
    return null;
  }
}

export type PhotoQuery = NonNullable<Awaited<ReturnType<typeof getPhotoById>>>