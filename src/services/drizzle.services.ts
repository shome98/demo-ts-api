import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { AnyPgTable, PgTableWithColumns } from "drizzle-orm/pg-core";

export class DrizzleService<T> {
  protected table: PgTableWithColumns<any>;
  protected db: NodePgDatabase;
  protected entityName: string;

  constructor(
    db: NodePgDatabase,
    table: PgTableWithColumns<any>,
    entityName = "Resource"
  ) {
    this.db = db;
    this.table = table;
      this.entityName = entityName;
      
       console.log("🔍 typeof table:", typeof table);
    //    console.log("🔍 table instanceof Object:", table instanceof Object);
    //    console.log("🔧 table keys:", Object.keys(table || {}));
    //    console.log("📦 table columns:", table?.columns);
    //    console.log("🔗 table name:", table?._.name);
    //    console.log("🧩 table constructor:", table?.constructor?.name);

    //    if (!table?.columns) {
    //      throw new Error(
    //        `Invalid table passed to DrizzleService: got ${typeof table}`
    //      );
    //    }
  }

  async create(data: T): Promise<T> {
    try {
      const [result] = await this.db
        .insert(this.table)
        .values(data as any)
        .returning();
      if (!result) {
        throw new Error("No result returned after insert");
      }
      return result as T;
    } catch (error) {
      throw new Error(
        `Could not create the ${this.entityName}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const result = await this.db.select().from(this.table);
      return result as T[];
    } catch (error) {
      throw new Error(
        `Could not fetch ${this.entityName}s : ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async findById(id: number):Promise<T> {
      try {
        if (isNaN(id)) {
          throw new Error("Invalid ID");
        }
      const result = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.columns.id, id))
        .limit(1);

      if (result.length === 0) {
        throw new Error(`${this.entityName} with ID ${id} not found`);
      }

      return result[0];
    } catch (error) {
      throw new Error(
        `Could not fetch ${this.entityName} : ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
    }
    
    async update(id:string|number,data:T) {
        try {
            const result = await this.db.update(this.table).set( {data} ).where(eq(this.table.columns.id, id));
            return result;
        } catch (error) {
            throw new Error(
              `Could not update ${this.entityName} : ${
                error instanceof Error ? error.message : String(error)
              }`
            );
        }
    }
}