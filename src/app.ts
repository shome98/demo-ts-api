import express from "express";
import config from "./environment/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import itemRoutes from "./routes/item.routes";

const app = express();
const port = config.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/items", itemRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port} http://localhost:${port}`);
});

export default app;
