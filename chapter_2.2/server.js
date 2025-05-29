// Finish
const express = require("express");
const app = express();
const PORT = 8000;

data = ["gehlee"];

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <body>
        <p>
            ${JSON.stringify(data)}
        </p>
    </body>
    `);
});

app.get("/dashboard", (req, res) => {
  console.log("hi", req.method);
  res.status(300).send("<i>hello</i>");
});

app.get("/api/data", (req, res) => {
  res.send(data);
});

app.post("/api/data", (req, res) => {
  const newEntry = req.body;
  console.log(newEntry);
  data.push(newEntry.name);
  console.log(data);
  res.sendStatus(201);
});

app.delete("api/endpoint", (req, res) => {
  data.pop();
  console.log("deleted");
  console.log(data);
  res.sendStatus(203);
});

app.listen(PORT, () => console.log(`Server has started on: ${PORT}`));
