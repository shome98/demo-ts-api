import express from "express";
import dotenv from "dotenv";
import config from "./environment/config";

const app = express();
const port = config.PORT || 3000;


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port} http://localhost:${port}`);
});

export default app;
