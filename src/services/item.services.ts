// services/item.service.ts
import { db } from "../db/connect.drizzle";
import { itemsTable } from "../models/schema";
import { eq } from "drizzle-orm";

// Infer types from Drizzle schema
type Item = typeof itemsTable.$inferSelect;
type ItemInsert = typeof itemsTable.$inferInsert;

export class ItemService {
  async create(data: ItemInsert): Promise<Item> {
    try {
      const [result] = await db.insert(itemsTable).values(data).returning();

      if (!result) {
        throw new Error("No result returned after insert");
      }

      return result;
    } catch (error) {
      console.error("Could not create item:", error);
      throw new Error(
        `Could not create item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  async findAll(): Promise<Item[]> {
    try {
      const result = await db.select().from(itemsTable);
      return result;
    } catch (error) {
      throw new Error(
        `Could not fetch items: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findById(id: number): Promise<Item> {
    try {
      if (isNaN(id)) throw new Error("Invalid ID");

      const [item] = await db
        .select()
        .from(itemsTable)
        .where(eq(itemsTable.id, id));

      if (!item) {
        throw new Error(`Item with ID ${id} not found`);
      }

      return item;
    } catch (error) {
      throw new Error(
        `Could not fetch item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateOne(id: number, data: Partial<ItemInsert>): Promise<Item> {
    try {
      if (isNaN(id)) {
        throw new Error("Invalid ID");
      }

      const result = await db
        .update(itemsTable)
        .set(data)
        .where(eq(itemsTable.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error(`Item with ID ${id} not found`);
      }

      return result[0];
    } catch (error) {
      console.error(`Could not update item with ID ${id}:`, error);
      throw new Error(
        `Could not update item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteOne(id: number): Promise<Item> {
    try {
      if (isNaN(id)) {
        throw new Error("Invalid ID");
      }

      const result = await db
        .delete(itemsTable)
        .where(eq(itemsTable.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error(`Item with ID ${id} not found`);
      }

      return result[0];
    } catch (error) {
      console.error(`Could not delete item with ID ${id}:`, error);
      throw new Error(
        `Could not delete item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const itemService = new ItemService();
/*
import { db } from "../db/connect.drizzle";
import { itemsTable } from "../models/schema";
import { eq } from "drizzle-orm";

// Infer types from Drizzle schema
type Item = typeof itemsTable.$inferSelect;
type ItemInsert = typeof itemsTable.$inferInsert;


export class ItemService<T> {
  protected table = itemsTable;
  
  constructor(table: any) {
    this.table = table;
  }
  async create(data: typeof this.table.$inferInsert): Promise<T> {
    try {
      const [result] = await db.insert(this.table).values(data).returning();

      if (!result) {
        throw new Error("No result returned after insert");
      }

      return result as T;
    } catch (error) {
      console.error("Could not create item:", error);
      throw new Error(
        `Could not create item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  async findAll(): Promise<T[]> {
    try {
      const result = await db.select().from(this.table);
      return result as T[];
    } catch (error) {
      throw new Error(
        `Could not fetch items: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findById(id: number): Promise<T> {
    try {
      if (isNaN(id)) throw new Error("Invalid ID");

      const [item] = await db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id));

      if (!item) {
        throw new Error(`Item with ID ${id} not found`);
      }

      return item as T;
    } catch (error) {
      throw new Error(
        `Could not fetch item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateOne(
    id: number,
    data: Partial<typeof this.table.$inferInsert>
  ): Promise<T> {
    try {
      if (isNaN(id)) {
        throw new Error("Invalid ID");
      }

      const result = await db
        .update(this.table)
        .set(data)
        .where(eq(this.table.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error(`Item with ID ${id} not found`);
      }

      return result[0] as T;
    } catch (error) {
      console.error(`Could not update item with ID ${id}:`, error);
      throw new Error(
        `Could not update item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteOne(id: number): Promise<T> {
    try {
      if (isNaN(id)) {
        throw new Error("Invalid ID");
      }

      const result = await db
        .delete(this.table)
        .where(eq(this.table.id, id))
        .returning();

      if (result.length === 0) {
        throw new Error(`Item with ID ${id} not found`);
      }

      return result[0] as T;
    } catch (error) {
      console.error(`Could not delete item with ID ${id}:`, error);
      throw new Error(
        `Could not delete item: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const itemService = new ItemService<Item>(itemsTable);
*/