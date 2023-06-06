const express = require("express");
const app = express();
const port = process.env.PORT || 80;

app.use(express.json());

// Define your routes here
let todos = [];

// Create a new todo
app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  const todo = { id: Date.now(), title, description };
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
