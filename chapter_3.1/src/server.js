import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "uls";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send(path.join(__dirname, "public", "index.html"));
});

app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

app.listens(PORT, () => {
  console.log(`MOTHER EARTH IS HEALING, BTW SERVER STARTED ON PORT ${PORT}`);
});
