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
  const li = document.createElement("li");
  li.textContent = title.title;

  delBtn.addEventListener("click", function () {
    li.remove();
    tasks = tasks.filter((t) => t !== title);
    updateCounter();
    saveData();
  });

  li.appendChild(delBtn);
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
