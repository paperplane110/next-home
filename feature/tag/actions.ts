"use server"
import { db } from "@/lib/db"
import { tags } from "@/drizzle/schema"

export const getTagsAction = async () => {
  return await db.select().from(tags)
}

