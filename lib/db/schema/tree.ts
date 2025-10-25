import { int, sqliteTable, text, AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const treeTable = sqliteTable('tree', {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    // 自引用，使用 AnySQLiteColumn 类型
    parentId: int('parent_id').references((): AnySQLiteColumn => treeTable.id),
})