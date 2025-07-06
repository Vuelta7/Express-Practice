# Chapter 3 of BACKEND COURSE

## 1. Setup the Environment

run these commands

```bash
npm init -y
npm install express bcryptjs jsonwebtoken
```

inside the package.json file, add this in scripts

```json
"dev": "node --watch --env-file=.env --experimental-strip-types --experimental-sqlite ./src/server.js",
```

and, change the type to module

```json
"type": "module",
```

Inside the package.json add a formality description:
`Dockerize nodejs express backend with prisma as orm and postgres as database`

then, create a folder and file structure

```plaintext
project/
├── src/
|   ├── prismaClient.js
│   ├── server.js
│   ├── middleware
│   │   └── authMiddleware.js
│   └── routes
│       ├── authRoutes.js
│       └── todoRoutes.js
├── public/
│   └── "copy the code in the repo"
├── documentation.md
└── .env
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

## 4. Configuring the Server.js

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

## 5. Prisma ORM Database Configuration

enter this command to initialize the prisma

```bash
npm install prisma @prisma/client pg
npx prisma init
```

Inside the schema.prisma, config the User and Todo model

```prisma
model User {
  id       Int    @id @default(autoincrement())
  username String @unique
  password String
  todos    Todo[]
}

model Todo {
  id        Int     @id @default(autoincrement())
  task      String
  completed Boolean @default(false)
  userId    Int
  user      User    @relation(fields: [userId], references: [id])
}
```

after writing this config model, run these command to generate the model

```bash
npx prisma format
npx prisma generate
```

inside the prismaClient.js add a initialization

```js
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();
export default prisma;
```

## 6. configure the Authentication in authRoutes.js

```js
// import the following
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

// initialize the express router
const router = express.Router();

// create a post router handler for register
router.post("/register", async (req, res) => {
  // getting the username and password variable
  const { username, password } = req.body;

  // encrypt the password to add security
  const hashPassword = bcrypt.hashSync(password, 8);

  try {
    // insert the newly register user in the db
    const user = await prisma.user.create({
      data: {
        username,
        password: hashPassword,
      },
    });

    // add a preparation for the inserts of todo
    const defaultTodo = `Hello :) Add your first todo!`;
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id,
      },
    });

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
router.post("/login", async (req, res) => {
  // getting the username and password variable
  const { username, password } = req.body;

  try {
    // get user and prepare to find the similar username
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

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
import prisma from "../prismaClient.js";

// initialize the database
const router = express.Router();

// create an endpoint for the for the /todos
router.get("/", async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: req.userId,
    },
  });
  res.json(todos);
});

// create an post for inserting new todos
router.post("/", async (req, res) => {
  const { task } = req.body;
  const todo = await prisma.todo.create({
    data: {
      task,
      userId: req.userId,
    },
  });

  res.json(todo);
});

// updating endpoint for the completed parameter
router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  // the use of "!!" is to make sure it's boolean
  const updatedTodo = await prisma.todo.update({
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

// delete the whole todo
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

// export the todo router
export default router;
```

## 9. Dockerize the project and configure the Prisma ORM

Create a "docker-compose.yaml" file

```yaml
version: "3"
services:
  app:
    build: .
    container_name: app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/todoapp
      - JWT_SECRET=your_jwt_secret_here
      - NODE_ENV=development
      - PORT=5003
    ports:
      - "5003:5003"
    depends_on:
      - db
    volumes:
      - .:/app

  db:
    image: postgres:13-alpine
    container_name: postgres-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: todoapp
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

And then, create a file named "Dockerfile"

```Dockerfile
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json files to the container
COPY package*.json .

COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
EXPOSE 5003

# Define the command to run your application
CMD ["node", "./src/server.js"]
```

To manually configure Prisma ORM

```bash
docker compose run --rm app sh
```

Inside the terminal for docker compose run these commands.

```bash
npx prisma generate

exit # To exit docker compose terminal
```

After manually configuring Prisma ORM

_or_

Maybe, you want to run or restart this env, run these commands

To start running the env

```bash
docker compose up --build
```

To stop the running of the env.

```bash
docker compose down
```

## 10.Access the App and do a Testing

Open `http://localhost:5003` in your browser to see the frontend. You can register, log in, and manage your todo list from there.

Incase of break out use this commands:

```bash
npx prisma format
npx prisma generate
docker compose build
docker compose run app npx prisma migrate dev --name init
docker compose up
```

```bash
docker-compose down --volumes --remove-orphans
docker image prune -a
rm -rf node_modules
rm -rf prisma/migrations
rm -rf prisma/dev.db
rm -rf node_modules/.prisma
rm -rf .prisma
npm install
```
