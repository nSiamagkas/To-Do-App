const todoInput = document.getElementById("todo-input");
const dueDateInput = document.getElementById("due-date");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const themeToggle = document.getElementById("toggle-theme");
const filters = document.querySelectorAll(".filters button");
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "All";

const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const renderTodos = () => {
  todoList.innerHTML = "";
  filters.forEach((btn) => btn.classList.remove("active"));
  const activeBtn = Array.from(filters).find(
    (btn) => btn.dataset.filter === currentFilter
  );
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  let filtered = [];
  if (currentFilter === "Active") {
    filtered = todos.filter(function (todo) {
      return todo.completed === false;
    });
  } else if (currentFilter === "Completed") {
    filtered = todos.filter(function (todo) {
      return todo.completed === true;
    });
  } else {
    filtered = todos.slice();
  }

  filtered.forEach(function (todo) {
    const li = document.createElement("li");
    li.className = "todo";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.onchange = function () {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    };

    label.appendChild(checkbox);
    const text = document.createElement("span");
    text.textContent = todo.text;
    if (todo.due) {
      text.textContent += " (Due: " + todo.due + ")";
    }
    if (todo.completed) {
      text.classList.add("line-through");
    }
    label.appendChild(text);

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.onclick = function () {
      todos = todos.filter(function (t) {
        return t.id !== todo.id;
      });
      saveTodos();
      renderTodos();
    };

    li.appendChild(label);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
};

const addTodo = () => {
  const text = todoInput.value.trim();
  const due = dueDateInput.value;
  if (text === "") return;
  todos.push({ id: Date.now(), text: text, due: due, completed: false });
  todoInput.value = "";
  dueDateInput.value = "";
  saveTodos();
  renderTodos();
};

addBtn.onclick = addTodo;

todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
});

dueDateInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
});

filters.forEach(function (btn) {
  btn.onclick = function () {
    currentFilter = btn.dataset.filter;
    renderTodos();
  };
});

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
};

renderTodos();
