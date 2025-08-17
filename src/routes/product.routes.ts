import { Router } from "express";
import { Product } from "../models/product.model";
import { MongodbService } from "../services/mongodb.services";
import { MongodbManyService } from "../services/mongodb.many.services";
import { MongodbQueryService } from "../services/mongodb.query.services";

const router = Router();

// Single create
router.post("/", async (req, res) => {
  try {
    const prodService = new MongodbService(Product);
    const product = await prodService.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    console.error(`😖 Could not create the product.`);
    return res
      .status(500)
      .json({
        error: "Internal server error : 😖 Could not create the product.",
      });
  }
});

// Bulk create
router.post("/products/bulk", async (req, res) => {
  try {
    const prodService = new MongodbManyService(Product);
    const products = await prodService.insertMany(req.body);
    return res.status(201).json(products);
  } catch (error) {
    console.error(`😖 Could not create products.`);
    return res
      .status(500)
      .json({ error: "Internal server error : 😖 Could not create products." });
  }
});

// Get all
router.get("/", async (req, res) => {
  try {
    const prodService = new MongodbService(Product);
    const products = await prodService.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error(`😖 Could not find products.`);
    return res
      .status(500)
      .json({ error: "Internal server error : 😖 Could not find products." });
  }
});

// Get by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prodService = new MongodbService(Product);
    const product = await prodService.findById(id);
    return res.status(200).json(product);
  } catch (error) {
    console.error(`😖 Could not find the product.`);
    return res
      .status(500)
      .json({
        error: "Internal server error : 😖 Could not find the product.",
      });
  }
});

// Query by filter
router.get("/products/query", async (req, res) => {
  try {
    const prodService = new MongodbQueryService(Product);
    const product = await prodService.findOneByQuery({
      name: "Product 1",
      description: "Product 1 description",
    });
    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error with ${error}` });
  }
});

// Update by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prodService = new MongodbService(Product);
    console.log(`id is ${id}`);
    console.log("body is ", req.body);
    const product = await prodService.update(id, req.body);
    return res.status(200).json(product);
  } catch (error) {
    console.error(`😖 Could not update the product.`);
    return res
      .status(500)
      .json({
        error: "Internal server error : 😖 Could not update the product.",
      });
  }
});

// Bulk update by query param ?id=id1,id2
router.put("/products/bulkUpdate", async (req, res) => {
  try {
    const { id } = req.query;
    const prodService = new MongodbManyService(Product);

    console.log(`id is ${id}`);
    console.log("body is ", req.body);

    const idString = Array.isArray(id) ? id.join(",") : (id as string);
    const idArray = idString.split(",").map((id) => id.trim());

    const result = await prodService.updateManyById(idArray, req.body);
    console.log("result is", result);

    return res.status(200).json(result); // Changed to 200 OK
  } catch (error) {
    console.error(`😖 Could not update the product.`);
    return res
      .status(500)
      .json({
        error: "Internal server error: 😖 Could not update the product.",
      });
  }
});

export default router;
