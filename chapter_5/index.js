const express = require("express");
const { User, sequelize } = require("./models"); // This will use models/index.js
const app = express();

app.use(express.json());

// REST API routes
app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  await user.update(req.body);
  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  await user.destroy();
  res.json({ message: "User deleted" });
});

// Start server after DB is ready
app.listen(3000, async () => {
  console.log("Server running at http://localhost:3000");
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
  } catch (err) {
    console.error("DB connection error:", err);
  }
});
