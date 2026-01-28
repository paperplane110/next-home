"use server";
import { db } from "@/drizzle/db";
import { tags, photoTags, type Tag } from "@/drizzle/schema";
import { ActionReturn } from "@/lib/types";
import { eq, inArray } from "drizzle-orm";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export async function getTags(): Promise<ActionReturn<Tag[]>> {
  try {
    const rows = await db.select().from(tags);
    return { success: true, data: rows };
  } catch (e) {
    console.error("Error fetching tags:", e);
    return { success: false, data: "Failed to get tags" };
  }
}

export async function createTag(name: string, slug?: string): Promise<ActionReturn<Tag>> {
  const finalName = name.trim();
  const finalSlug = (slug && slug.trim()) || slugify(finalName);
  try {
    // check duplicate by name or slug
    const existing = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, finalSlug));
    if (existing.length > 0) {
      return { success: false, data: "Tag with this slug already exists" };
    }

    const inserted = await db
      .insert(tags)
      .values({ name: finalName, slug: finalSlug })
      .returning();
    return { success: true, data: inserted[0] };
  } catch (e) {
    console.error("Error creating tag:", e);
    return { success: false, data: "Failed to create tag" };
  }
}

export async function updateTag(id: string, payload: { name?: string; slug?: string }): Promise<ActionReturn<Tag>> {
  const values: Partial<{ name: string; slug: string }> = {};
  if (payload.name) values.name = payload.name.trim();
  if (payload.slug) values.slug = payload.slug.trim();
  try {
    const updated = await db
      .update(tags)
      .set(values)
      .where(eq(tags.id, id))
      .returning();
    return { success: true, data: updated[0] };
  } catch (e) {
    console.error("Error updating tag:", e);
    return { success: false, data: "Failed to update tag" };
  }
}

export async function deleteTag(id: string): Promise<ActionReturn<Tag>> {
  try {
    const deleted = await db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning();
    return { success: true, data: deleted[0] };
  } catch (e) {
    console.error("Error deleting tag:", e);
    return { success: false, data: "Failed to delete tag" };
  }
}

/**
 * 设置照片的标签关联
 * 采用“全量覆盖”策略：先删除旧关联，再插入新关联。
 * 同时确保传入的所有标签名在 tags 表中都已存在（不存在则自动创建）。
 * 返回最终照片所关联的所有完整标签对象
 */
export async function setPhotoTags(photoId: string, tagNames: string[]): Promise<ActionReturn<Tag[]>> {
  // 1. 数据清洗：去重、修剪空格、过滤空字符串
  const names = Array.from(new Set(tagNames.map((n) => n.trim()).filter(Boolean)));

  try {
    // 2. 确保所有标签在数据库中都存在
    // 首先查询已存在的标签
    const existing = await db.select().from(tags).where(inArray(tags.name, names));
    const existingMap = new Map(existing.map((t) => [t.name, t]));
    
    // 找出需要新创建的标签名
    const toCreate = names.filter((n) => !existingMap.has(n));
    if (toCreate.length > 0) {
      for (const name of toCreate) {
        const created = await createTag(name);
        if (created.success) {
          existingMap.set(name, created.data as Tag);
        }
      }
    }
    
    // 获取最终所有对应的完整标签对象
    const finalTags = names.map((n) => existingMap.get(n)).filter((t): t is Tag => !!t);
    const tagIds = finalTags.map(t => t.id);

    // 3. 更新多对多关联表 (photo_tags)
    // 采用同步策略：先删除该照片现有的所有标签关联
    await db.delete(photoTags).where(eq(photoTags.photoId, photoId));
    
    // 如果没有传入标签，则到此结束，返回空数组
    if (tagIds.length === 0) {
      return { success: true, data: [] };
    }

    // 4. 批量插入新的关联关系
    const rows = tagIds.map((tid) => ({ photoId, tagId: tid }));
    await db.insert(photoTags).values(rows);
    
    // 返回最终生效的标签列表，方便前端更新 UI
    return { success: true, data: finalTags };
  } catch (e) {
    console.error("Failed to set photo tags:", e);
    return { success: false, data: "Failed to set photo tags" };
  }
}
