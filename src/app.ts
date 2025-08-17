import express from "express";
import config from "./environment/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./db/connect.mongo";
import productRoutes from "./routes/product.routes";

const app = express();
const port = config.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/products", productRoutes);

connectToDatabase()
  .then(() => console.log("✅ Connected to database"))
  .catch((error) => console.log("❌ Database connection Failed with ", error));

app.listen(port, () => {
  console.log(`Server running on port ${port} http://localhost:${port}`);
});

export default app;
