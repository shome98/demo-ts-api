import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const itemsTable = pgTable("Items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
});
