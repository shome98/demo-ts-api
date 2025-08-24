import { Router } from "express";
import { DrizzleService } from "../services/drizzle.services";
import { db } from "../db/connect.drizzle";
import { itemsTable } from "../models/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => { 
    const dbService = new DrizzleService<typeof itemsTable.$inferSelect>(
      db,
      itemsTable,
      "Item"
    );
    const items = await dbService.findAll();
    res.status(200).json({ message: "😊 Hi all okay from get.", items: items });
});
router.post("/", async (req, res) =>{
    try {
      // ✅ Pass the table object, not a string
      const dbService = new DrizzleService<typeof itemsTable.$inferInsert>(
        db,
        itemsTable,
        "Item"
      );

      const newItem = await dbService.create(req.body);

      return res.status(201).json({
        message: "Item created successfully",
        item: newItem,
      });
    } catch (error) {
      console.error(`😖 Could not create the item:`, error);
      return res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
});
router.put("/:id", async (req, res) =>{
    try {
        // ✅ Pass the table object, not a string
        const { id } = req.params;
    //   const dbService = new DrizzleService<typeof itemsTable.$inferInsert>(
    //     db,
    //     itemsTable,
    //     "Item"
    //   );

        //   const updated = await dbService.update(id,req.body);
        const result = await db
            .update(itemsTable)
            .set(req.body)
          .where(eq(itemsTable.id, parseInt(id))).returning();

      return res.status(201).json({
        message: "Item updated successfully",
        item: result,
      });
    } catch (error) {
      console.error(`😖 Could not update the item:`, error);
      return res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
});
router.get("/:id", async (req, res) =>{
    try {
        // ✅ Pass the table object, not a string
        const { id } = req.params;
        console.log("id is ",id)
    //   const dbService = new DrizzleService<typeof itemsTable.$inferSelect>(
    //     db,
    //     itemsTable,
    //     "Item"
    //   );

    //   const item = await dbService.findById(parseInt(id,10));

        const result = await db.select()
                .from(itemsTable)
                .where(eq(itemsTable.id, parseInt(id)))
                .limit(1);
      return res.status(201).json({
        message: "Item fetched successfully",
        item:result[0]
      });
    } catch (error) {
      console.error(`😖 Could not create the item:`, error);
      return res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
});

export default router;
