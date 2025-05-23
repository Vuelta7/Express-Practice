import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", () => {
  const getTodos = db.prepare("SELECT * FROM todos WHERE user_id = ?");
  const todos = getTodos.all(req.userID);
  res.json(todos);
});

router.post("/", () => {});

router.put("/:id", () => {});

router.delete("/:id", () => {});

export default router;
