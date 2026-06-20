const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

let archivedTasks = [];
let currentView = "tasks";
let currentFilter = "all";
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
  renderTasks(currentFilter);
  taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function saveData() {
  localStorage.setItem("todo-list-archive", JSON.stringify(archivedTasks));
  localStorage.setItem("todo-list", JSON.stringify(tasks));
}

function loadData() {
  let savedArchive = localStorage.getItem("todo-list-archive");
  let saved = localStorage.getItem("todo-list");

  if (saved) {
    tasks = JSON.parse(saved);

    renderTasks("all");
  }
  if (savedArchive) {
    archivedTasks = JSON.parse(savedArchive);
  }
}

function createTaskElement(title) {
  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = title.completed;
  const li = document.createElement("li");
  const span = document.createElement("span");
  if (title.completed === true) {
    span.style.textDecoration = "line-through";
  }
  span.textContent = title.title;

  delBtn.addEventListener("click", function () {
    archivedTasks.push(title);
    tasks = tasks.filter((t) => t !== title);
    saveData();
    renderTasks(currentFilter);
  });

  input.addEventListener("change", function () {
    title.completed = input.checked;
    if (title.completed === true) {
      span.style.textDecoration = "line-through";
    } else {
      span.style.textDecoration = "";
    }
    saveData();
  });

  li.appendChild(delBtn);
  taskList.appendChild(li);
  li.insertBefore(span, delBtn);
  li.prepend(input);
}

function updateCounter(count, filter) {
  if (filter === "all") {
    if (count === 1) {
      taskCounter.textContent = count + " task";
    } else {
      taskCounter.textContent = count + " tasks";
    }
  }
  if (filter === "active") {
    if (count === 1) {
      taskCounter.textContent = "Left: " + count + " task";
    } else {
      taskCounter.textContent = "Left: " + count + " tasks";
    }
  }
  if (filter === "completed") {
    if (count === 1) {
      taskCounter.textContent = "Done: " + count + " task";
    } else {
      taskCounter.textContent = "Done: " + count + " tasks";
    }
  }
}
function renderTasks(filter) {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(function (t) {
    if (filter === "all") {
      return true;
    }
    if (filter === "active") {
      return t.completed === false;
    }
    if (filter === "completed") {
      return t.completed === true;
    }
  });
  filteredTasks.forEach(createTaskElement);
  updateCounter(filteredTasks.length, filter);
}
function renderArchive(filter) {
  taskList.innerHTML = "";
  let filteredArchive = archivedTasks.filter(function (t) {
    if (filter === "all") {
      return true;
    }
    if (filter === "active") {
      return t.completed === false;
    }
    if (filter === "completed") {
      return t.completed === true;
    }
  });
  filteredArchive.forEach(createArchiveTaskElement);
  updateCounter(filteredArchive.length, filter);
}
document.getElementById("archiveTasks").addEventListener("click", function () {
  if (currentView === "tasks") {
    document.getElementById("archiveTasks").textContent = "Tasks";
    currentView = "archive";
    renderArchive(currentFilter);
  } else {
    document.getElementById("archiveTasks").textContent = "Archive";
    currentView = "tasks";
    renderTasks(currentFilter);
  }
});
function createArchiveTaskElement(title) {
  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = title.completed;
  const li = document.createElement("li");
  const span = document.createElement("span");
  const returnBtn = document.createElement("button");
  returnBtn.textContent = "↩";
  returnBtn.classList.add("returnBtn");
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btnGroup");

  if (title.completed === true) {
    span.style.textDecoration = "line-through";
  }
  span.textContent = title.title;
  delBtn.addEventListener("click", function () {
    archivedTasks = archivedTasks.filter((t) => t !== title);
    saveData();
    renderArchive(currentFilter);
  });
  input.addEventListener("change", function () {
    title.completed = input.checked;
    if (title.completed === true) {
      span.style.textDecoration = "line-through";
    } else {
      span.style.textDecoration = "";
    }
    saveData();
  });
  returnBtn.addEventListener("click", function () {
    archivedTasks = archivedTasks.filter((t) => t !== title);
    tasks.push(title);
    saveData();
    renderArchive(currentFilter);
  });

  btnGroup.appendChild(returnBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(btnGroup);
  taskList.appendChild(li);
  li.insertBefore(span, btnGroup);
  li.prepend(input);
}
loadData();
