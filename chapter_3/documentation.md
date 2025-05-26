# Chapter 3 of BACKEND COURSE

## 1. Setup the Environment

run these commands

```bash
npm ini -y
npm install express bcryptjs jsonwebtoken
```

inside the package.json file, add this in scripts

```json
"dev": "node --watch --env-file=.env --experimental-strip-types --experimental-sqlite ./src/server.js",
```

then, create a folder and file structure

```plaintext
project/
├── src/
│   ├── db.js
│   ├── server.js
│   ├── middleware
│   │   └── authMiddleware.js
│   └── routes
│       ├── authRoutes.js
│       └── todoRoutes.js
├── public/
│   └── "copy the code in the repo"
├── documentation.md
├── .env
└── todo-app.rest
```

## 2. Add the Client side

get the content in public folder here, create the files and copy and paste it
<br><a href="https://github.com/Vuelta7/Express-Practice/tree/main/chapter_3/public">public fodler<a>

## 3. .Env configuration

inside the .env file

```.env
JWT_SECRET="your_jwt_secret_key"
PORT="8000"
```

## 4. Add a testing for .rest file

```
### GET /
GET http://localhost:8000

### REGISTER user to the /auth/register
POST http://localhost:8000/auth/register
Content-Type: application/json

{
    "username": "gehlee@gmail.com",
    "password": "12345678"
}

### LOGIN user to the /auth/login
POST http://localhost:8000/auth/login
Content-Type: application/json

{
   "username": "gehlee@gmail.com",
    "password": "12345678"
}
```

## 5. Configuring the Server.js

```js
// Modern way of importing in nodejs
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// add this after configuring the Routes
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

// initializing the expressjs
const app = express();
const PORT = process.env.PORT || 8000;

// static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// add this after configuring the Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

// listens to the fetching
app.listen(PORT, () => {
  console.log(`Server Started on port: ${PORT}`);
});
```

## 5. inside the db.js, create a sql injection

```js
// import the built-in node sqlite
import { DatabaseSync } from "node:sqlite";
// initialize the database
const db = new DatabaseSync(":memory:");

// create tables for the users
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

// create tables for todos
db.exec(`
    CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`);

// export the db
export default db;
```

## 6. configure the Authentication in authRoutes.js

```js
// import the following
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

// initialize the express router
const router = express.Router();

// create a post router handler for register
router.post("/register", (req, res) => {
  // getting the username and password variable
  const { username, password } = req.body;

  // encrypt the password to add security
  const hashPassword = bcrypt.hashSync(password, 8);

  try {
    // insert the newly register user in the db
    const insertUser = db.prepare(
      `INSERT INTO users (username, password) VALUES (?, ?)`
    );
    // encrypt the password the insert in db
    const result = insertUser.run(username, hashPassword);

    // add a preparation for the inserts of todo
    const defaultTodo = `Hello :) Add your first todo!`;
    const insertTodo = db.prepare(
      `INSERT INTO todos (user_id, task) VALUES (?, ?)`
    );
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // create a random token that expires in 24h
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // return the token in client side
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

// create a post router handler for login
router.post("/login", (req, res) => {
  // getting the username and password variable
  const { username, password } = req.body;

  try {
    // get user and prepare to find the similar username
    const getUser = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = getUser.get(username);

    // user not found
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // functionality to compare in encrypted state
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    // password not match
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password" });
    }

    // debug to know if the user successfully logged in
    console.log(user);

    // create a random token that expires in 24h
    const token = jwt.sign({ id: user }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // return the token in client side
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

// export the auth router
export default router;
```

## 7. configure the authMiddleware

```js
// import the jwt
import jwt from "jsonwebtoken";

// middleware to check if there a token
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  // if theres no token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // if it has token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
  });
}

// export the middleware
export default authMiddleware;
```

## 8. configure the todo routes

```js
// import the following
import express from "express";
import db from "../db.js";

// initialize the database
const router = express.Router();

// create an endpoint for the for the /todos
router.get("/", (req, res) => {
  const getTodos = db.prepare("SELECT * FROM todos WHERE user_id = ?");
  const todos = getTodos.all(req.userId);
  res.json(todos);
});

// create an post for inserting new todos
router.post("/", (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(
    `INSERT INTO todos (user_id, task) VALUES (?, ?)`
  );
  const result = insertTodo.run(req.userId, task);

  res.json({ id: result.lastInsertRowid, task, completed: 0 });
});

// updating endpoint for the completed parameter
router.put("/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const { page } = req.query;

  const updatedTodo = db.prepare("UPDATE todos SET completed = ? WHERE id = ?");
  updatedTodo.run(completed, id);

  res.json({ message: " Todo completed" });
});

// delete the whole todo
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const deleteTodo = db.prepare(
    "DELETE FROM todos WHERE id = ? AND user_id = ?"
  );

  deleteTodo.run(id, userId);
  res.send({ message: "Todo deleted" });
});

// export the todo router
export default router;
```

## 9. Testing

test the routes in client side and todo-app.rest
