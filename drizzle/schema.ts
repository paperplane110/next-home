import { pgTable, uuid, varchar, text, integer, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { z } from "zod";
import { InferSelectModel } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().defaultRandom(),

  // 基础信息
  title: varchar("title", { length: 255 }).notNull(),
  creator: varchar("creator", { length: 255 }), // 图片创作者
  description: text("description"),
  location: varchar("location", { length: 255 }), // 存储图片的地理位置
  capturedAt: varchar("captured_at", { length: 20 }), // 创作时间
  tags: text("tags").array(), // 标签，逗号分隔

  // Vercel Blob 提供的核心字段
  url: text("url").notNull(),          // 图片的访问地址
  pathname: text("pathname").notNull(), // 在 Blob 仓库中的路径（用于删除图片）
  contentType: varchar("content_type", { length: 50 }).notNull(), // image/jpeg, image/png 等
  size: integer("size").notNull(),               // 文件大小（字节）

  // 图片属性（建议在上传时获取，方便前端做响应式布局和占位）
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  aspectRatio: varchar("aspect_ratio", { length: 20 }).notNull(),
  isVertical: boolean("is_vertical").default(true).notNull(), // 是否为垂直图片
  md5: varchar("md5", { length: 32 }).notNull().unique(), // 图片的 MD5 值，用于去重
  blurbase64: varchar("blurbase64", { length: 255 }), // 存储生成的 ThumbHash Base64 字符串

  // 摄影元数据 (EXIF) - 可选，提升专业感
  //   camera: varchar("camera", { length: 100 }), // 例如: Sony A7IV
  //   lens: varchar("lens", { length: 100 }),     // 例如: 35mm f/1.4
  //   focalLength: varchar("focal_length", { length: 20 }),
  //   aperture: varchar("aperture", { length: 20 }),
  //   shutterSpeed: varchar("shutter_speed", { length: 20 }),
  //   iso: integer("iso"),

  // --- 排序与逻辑控制 ---
  priority: integer("priority").default(0), // 数值越大越靠前

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index('md5_idx').on(table.md5)
]);

// --- Tags: 多对多 ---
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull().unique(), // 人类可读的标签名称
  slug: varchar("slug", { length: 64 }).unique(), // 用于 URL  slug，例如: "beach-sunset"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const photoTags = pgTable("photo_tags", {
  photoId: uuid("photo_id").notNull().references(() => photos.id, { onDelete: "cascade", onUpdate: "cascade" }),
  tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("photo_tags_photo_idx").on(table.photoId),
  index("photo_tags_tag_idx").on(table.tagId),
]);

export const photoInsertSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const photoUploadFormSchema = createInsertSchema(photos, {
  title: z.string().min(1, "Title is required"),
  capturedAt: z.string().min(1, "Captured At is required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,

  width: true,
  height: true,
  aspectRatio: true,
  isVertical: true,
  blurbase64: true,
  md5: true,

  url: true,
  pathname: true,
  contentType: true,
  size: true,
}).extend({
  imgFile: z.instanceof(File, { message: "Image is required" }),
})

export const tagInsertSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Photo = InferSelectModel<typeof photos>
export type PhotoInsert = z.infer<typeof photoInsertSchema>
export type PhotoUploadForm = z.infer<typeof photoUploadFormSchema>
export type Tag = InferSelectModel<typeof tags>
export type TagInsert = z.infer<typeof tagInsertSchema>
