const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");

let suppressClearConfirm = false;
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

document.getElementById("allBtn").addEventListener("click", function () {
  currentFilter = "all";
  renderTasks("all");
});
document.getElementById("activeBtn").addEventListener("click", function () {
  currentFilter = "active";
  renderTasks("active");
});
document.getElementById("completedBtn").addEventListener("click", function () {
  currentFilter = "completed";
  renderTasks("completed");
});

function saveData() {
  localStorage.setItem("todo-list-archive", JSON.stringify(archivedTasks));
  localStorage.setItem("todo-list", JSON.stringify(tasks));
}
function loadData() {
  let savedArchive = localStorage.getItem("todo-list-archive");
  let saved = localStorage.getItem("todo-list");

  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch {
      tasks = [];
    }
    renderTasks("all");
  }
  if (savedArchive) {
    try {
      archivedTasks = JSON.parse(savedArchive);
    } catch {
      archivedTasks = [];
    }
  }
}

function createTaskElement(task) {
  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = task.completed;
  const li = document.createElement("li");
  const span = document.createElement("span");
  const inputEditing = document.createElement("input");
  inputEditing.id = "inputEdit";
  if (task.completed === true) {
    span.style.textDecoration = "line-through";
  }
  span.textContent = task.title;
  span.title = "Click to edit";

  span.addEventListener("click", function () {
    span.parentNode.insertBefore(inputEditing, span);
    span.style.display = "none";
    inputEditing.value = task.title;
    inputEditing.style.display = "";
    inputEditing.focus();
    inputEditing.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        if (inputEditing.value.trim() === "") {
          alert("the string cannot be empty.");
          return;
        } else {
          task.title = inputEditing.value;
          saveData();
          renderTasks(currentFilter);
        }
      }
    });
  });
  inputEditing.addEventListener("blur", function () {
    span.style.display = "";
    inputEditing.style.display = "none";
  });
  delBtn.addEventListener("click", function () {
    archivedTasks.push(task);
    tasks = tasks.filter((t) => t.id !== task.id);
    saveData();
    renderTasks(currentFilter);
  });

  input.addEventListener("change", function () {
    task.completed = input.checked;
    if (task.completed === true) {
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
function createArchiveTaskElement(task) {
  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = task.completed;
  const li = document.createElement("li");
  const span = document.createElement("span");
  const returnBtn = document.createElement("button");
  returnBtn.textContent = "↩";
  returnBtn.classList.add("returnBtn");
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btnGroup");

  if (task.completed === true) {
    span.style.textDecoration = "line-through";
  }
  span.textContent = task.title;
  delBtn.addEventListener("click", function () {
    archivedTasks = archivedTasks.filter((t) => t.id !== task.id);
    saveData();
    renderArchive(currentFilter);
  });
  input.addEventListener("change", function () {
    task.completed = input.checked;
    if (task.completed === true) {
      span.style.textDecoration = "line-through";
    } else {
      span.style.textDecoration = "";
    }
    saveData();
  });
  returnBtn.addEventListener("click", function () {
    archivedTasks = archivedTasks.filter((t) => t.id !== task.id);
    tasks.push(task);
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
document.getElementById("clearBtn").addEventListener("click", function () {
  if (suppressClearConfirm) {
    if (currentFilter === "all") {
      archivedTasks.push(...tasks);
      tasks = [];
    } else if (currentFilter === "active") {
      let activeTasks = tasks.filter((t) => t.completed === false);
      archivedTasks.push(...activeTasks);
      tasks = tasks.filter((t) => t.completed === true);
    } else if (currentFilter === "completed") {
      let completedTasks = tasks.filter((t) => t.completed === true);
      archivedTasks.push(...completedTasks);
      tasks = tasks.filter((t) => t.completed === false);
    }
    saveData();
    renderTasks(currentFilter);
  } else {
    document.getElementById("confirmOverlay").style.display = "flex";
  }
});
document.getElementById("confirmNo").addEventListener("click", function () {
  document.getElementById("confirmOverlay").style.display = "none";
});
document.getElementById("confirmYes").addEventListener("click", function () {
  if (currentView === "tasks") {
    if (currentFilter === "all") {
      archivedTasks.push(...tasks);
      tasks = [];
    } else if (currentFilter === "active") {
      let activeTasks = tasks.filter((t) => t.completed === false);
      archivedTasks.push(...activeTasks);
      tasks = tasks.filter((t) => t.completed === true);
    } else if (currentFilter === "completed") {
      let completedTasks = tasks.filter((t) => t.completed === true);
      archivedTasks.push(...completedTasks);
      tasks = tasks.filter((t) => t.completed === false);
    }
    saveData();
    renderTasks(currentFilter);
  } else {
    archivedTasks = [];
    saveData();
    renderArchive(currentFilter);
  }
  if (document.getElementById("dontShowAgain").checked) {
    suppressClearConfirm = true;
  }
  document.getElementById("confirmOverlay").style.display = "none";
});
loadData();
