import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await Prisma.todo.findMany({
    where: {
      userId: req.userId,
    },
  });
  res.json(todos);
});

router.post("/", async (req, res) => {
  const { task } = req.body;
  const todo = await Prisma.todo.create({
    data: {
      task,
      userId: req.userId,
    },
  });

  res.json(todo);
});

router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updatedTodo = await Prisma.todo.update({
    where: {
      id: parseInt(id),
      userId: req.userId,
    },
    data: {
      completed: !!completed,
    },
  });

  res.json(updatedTodo);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  await prisma.todo.delete({
    where: {
      id: parseInt(id),
      userId,
    },
  });

  deleteTodo.run(id, userId);
  res.send({ message: "Todo deleted" });
});

export default router;
