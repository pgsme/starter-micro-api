const express = require("express");
const app = express();
const port = process.env.PORT || 80;

const admin = require("firebase-admin");

// Initialize the app with your service account key
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Other configuration options if needed
});

// Set the view engine to hbs
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.json());

// Define your routes here
let todos = [];

app.get("/", function (req, res) {
  res.render("index", { title: "Express.js with Handlebars" });
});

// Create a new todo
app.post("/todos", (req, res) => {
  const { title, description, token } = req.body;
  const todo = { id: Date.now(), title, description };
  const message = {
    notification: {
      title: "Notification Title",
      body: "Notification Body",
    },
    token: token,
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent notification:", response);
    })
    .catch((error) => {
      console.log("Error sending notification:", error);
    });
  todos.push(todo);
  res.status(201).json(todo);
});

// Read all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Read a single todo
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((todo) => todo.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.json(todo);
});

// Update a todo
app.put("/todos/:id", (req, res) => {
  const todo = todos.find((todo) => todo.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todo.title = req.body.title || todo.title;
  todo.description = req.body.description || todo.description;
  res.json(todo);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex((todo) => todo.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const deletedTodo = todos.splice(index, 1)[0];
  res.json(deletedTodo);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
