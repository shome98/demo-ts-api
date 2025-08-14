import express from "express";
import config from "./environment/config";
import connectToDatabase from "./db/connect.mongo";

const app = express();
const port = config.PORT || 3000;


app.get("/", (req, res) => {
  res.send("Hello, world!");
});
connectToDatabase()
  .then(() => console.log("✅ Connected to database"))
  .catch((error) => console.log("❌ Database connection Failed with ", error));

app.listen(port, () => {
  console.log(`Server running on port ${port} http://localhost:${port}`);
});

export default app;
