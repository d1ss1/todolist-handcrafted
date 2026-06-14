const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

let tasks = [];

function addTask() {
  const text = taskInput.value.trim();
  const newTask = {
    id: Date.now(),
    title: text,
    completed: false,
  };

  if (text === "") {
    alert("Enter a Task");
    return;
  }

  tasks.push(newTask);
  saveData();
  createTaskElement(newTask);
  taskInput.value = "";
  updateCounter();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function saveData() {
  localStorage.setItem("todo-list", JSON.stringify(tasks));
}

function loadData() {
  let saved = localStorage.getItem("todo-list");

  if (saved) {
    tasks = JSON.parse(saved);

    tasks.forEach(function (t) {
      createTaskElement(t);
    });
    updateCounter();
  }
}

function createTaskElement(title) {
  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = title.completed;
  const li = document.createElement("li");
  if (title.completed === true) {
    li.style.textDecoration = "line-through";
  }
  li.textContent = title.title;

  delBtn.addEventListener("click", function () {
    li.remove();
    tasks = tasks.filter((t) => t !== title);
    updateCounter();
    saveData();
  });

  input.addEventListener("change", function () {
    title.completed = input.checked;
    if (title.completed === true) {
      li.style.textDecoration = "line-through";
    } else {
      li.style.textDecoration = "";
    }
    saveData();
  });

  li.appendChild(delBtn);
  li.prepend(input);
  taskList.appendChild(li);
}

function updateCounter() {
  if (tasks.length <= 1) {
    taskCounter.textContent = "Left: " + tasks.length + " task";
  } else {
    taskCounter.textContent = "Left: " + tasks.length + " tasks";
  }
}
loadData();
