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

## 2. Configuring the Server.js

```js
// Modern way of importing in nodejs
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

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

// listens to the fetching
app.listen(PORT, () => {
  console.log(`Server Started on port: ${PORT}`);
});
```

# 3:44:00 FIX THE ISSUE, CLIENT NOT SHOWING ERRORS AND NOT SENDING PROPERLY IN API
