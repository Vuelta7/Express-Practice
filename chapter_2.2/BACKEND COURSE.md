# BACKEND COURSE TUTORIAL

## 1. Setting up the project

run this commands

```bash
npm init -y
npm install express
npm install --save-dev nodemon
```

in package.json add this

```javascript
 "dev": "nodemon server.js",
```

make file server.js

```js
const express = require("express"); // importation in node.js
const app = express(); // initialize the express dependencies
const PORT = 8000; // PORT that you will use. ps: you can use anything
app.listen(PORT, () => console.log(`Server has started on: ${PORT}`)); // add a listener for api fetching
```

## 2. Types of CRUD METHOLOGY and configurations

understand the CRUD METHOLOGY

- CRUD METHODS
- create - POST
- read - GET
- update - PUT
- delete - DELETE

write and understand the different types of CRUD configuration

```js
data = ["katelyn"]; // mock data

// to convert it into json format
app.use(express.json());

// example of using it as an html documenting
app.get("/", (req, res) => {
  res.send(`
        <body>
            <p>
            ${JSON.stringify(data)}
            </p>
        </body>
        `);
});

// example of sending custom status code
app.get("/dashboard", (req, res) => {
  console.log("niggers", req.method);
  res.status(300).send("<i>dewi</i>");
});

// sendind the mock data
app.get("/api/data", (req, res) => {
  res.send(data);
});

// posting of new data to add in mock data
app.post("/api/data", (req, res) => {
  const newEntry = req.body;
  console.log(newEntry);
  data.push(newEntry.name);
  console.log(data);
  res.sendStatus(201);
});

// example of deleting data in mock data
app.delete("/api/endpoint", (req, res) => {
  data.pop();
  console.log("deleted");
  console.log(data);
  res.sendStatus(203);
});
```

Test it by using the extension REST CLIENT.
make a test.rest file

```
### Test Get / WEBSITE
GET http://localhost:8000

### Test get /dashboard website
GET http://localhost:8000/dashboard

### Data Endpoint
GET http://localhost:8000/api/data

### Data Endpoint for adding a user
POST http://localhost:8000/api/data
Content-Type: application/json

{
    "name": "elisia"
}

### Delete Endpoint
DELETE http://localhost:8000/api/endpoint
```
