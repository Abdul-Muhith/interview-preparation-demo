// ******** Function to Select any Html Element using CSS selector ********
function $(selector) {
  return document.querySelector(selector);
}

// ******** Function to Create a New Element ********
function createNewElement({ tag, className, id, style, innerHTML }) {
  let createdElement = null;

  if (!tag) {
    createdElement = document.createElement("div");
  } else {
    if (typeof tag === "string") {
      createdElement = document.createElement(tag);
    }
  }

  if (className) createdElement.className = className;

  if (id) createdElement.setAttribute("id", id);

  if (style && typeof style === "object") {
    Object.assign(createdElement.style, style);
  }

  if (innerHTML) {
    createdElement.innerHTML = innerHTML;
  }

  return createdElement;
}

// ******** Function to Delete an Element ********
function deleteElement(event, parentElement, element) {
  event.addEventListener("click", function () {
    parentElement.removeChild(element);

    // Update localStorage after deletion
    saveTasksToLocalStorage();
  });
}

// ******** Function to Save Tasks to LocalStorage ********
function saveTasksToLocalStorage() {
  const tasks = [];
  const taskElements = document.querySelectorAll(".single-task p");

  taskElements.forEach((task) => {
    tasks.push(task.innerHTML);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ******** Function to Load Tasks from LocalStorage ********
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => handleTask(allTasks, task));
}

// ******** Selecting HTML Elements ********
const taskField = $("#taskField");
const addTaskBtn = $("#addTaskBtn");
const allTasks = $("#allTasks");

// ******** Load existing tasks when the page loads ********
loadTasksFromLocalStorage();

// ******** Handling Input Field ********
taskField.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    const taskValue = event.target.value.trim();

    if (taskValue) {
      handleTask(allTasks, taskValue);

      this.value = ""; // event.target.value = "";

      // Store to localStorage
      saveTasksToLocalStorage();
    } else {
      alert("Kindly enter at least one additional task.");
    }
  }
});

// ******** Handling Add Task Button ********
addTaskBtn.addEventListener("click", function () {
  const taskValue = taskField.value.trim();

  if (taskValue) {
    handleTask(allTasks, taskValue);

    taskField.value = "";

    // Store to localStorage
    saveTasksToLocalStorage();
  } else {
    alert("Kindly enter at least one additional task.");
  }
});

// ******** Handling Tasks ********
function handleTask(parentElement, newElement) {
  // Create a new Task
  let singleTask = createNewElement({
    className: "single-task col-sm-3 d-flex justify-content-between",
  });

  parentElement.appendChild(singleTask);

  // Add a Paragraph to each Task
  let singleTaskP = createNewElement({ tag: "p", innerHTML: newElement });

  singleTask.appendChild(singleTaskP);

  // Add a Controller to each Task
  let taskController = handleTaskController(singleTask);

  singleTask.onmouseenter = function () {
    taskController.style.visibility = "visible";
  };

  singleTask.onmouseleave = function () {
    taskController.style.visibility = "hidden";
  };

  singleTask.appendChild(taskController);
}

// ******** Handling Task Controller ********
function handleTaskController(singleTask) {
  let controlPanel = createNewElement({
    className:
      "task-control-panel d-flex justify-content-center gap-4 text-center align-items-center",
    style: { visibility: "hidden" },
  });

  // Add a Removal Button to each Controller
  let removalBtn = handleRemovalBtn(allTasks, singleTask);

  // Add a Edit Button to each Controller
  let editBtn = handleEditBtn(singleTask);

  // Add a Mark Button to each Controller
  let markBtn = handleMarkBtn(singleTask);

  controlPanel.appendChild(markBtn);
  controlPanel.appendChild(editBtn);
  controlPanel.appendChild(removalBtn);

  return controlPanel;
}

// ******** Handling Removal Button ********
function handleRemovalBtn(parentElement, singleElement) {
  let removalBtn = createNewElement({
    tag: "span",
    id: "removalBtn",
    innerHTML: `<i class="fa-solid fa-delete-left"></i>`,
    style: { color: "#fff", cursor: "pointer" },
  });

  // Delete an existing Task
  deleteElement(removalBtn, parentElement, singleElement);

  return removalBtn;
}

// ******** Handling Edit Button ********
function handleEditBtn(parentElement) {
  let editBtn = createNewElement({
    tag: "span",
    innerHTML: `<i class="fa-solid fa-pen-to-square"></i>`,
    style: { color: "#fff", cursor: "pointer" },
  });

  editBtn.addEventListener("click", function () {
    let p = parentElement.querySelector("p");

    // Creating & Handling a new Text Area
    let textArea = createNewElement({
      tag: "textarea",
      className: "inner-textarea",
      innerHTML: p.innerHTML,
      style: {
        width: parentElement.offsetWidth + "px",
        height: parentElement.offsetHeight + "px",
      },
    });

    textArea.addEventListener("keypress", function (event) {
      const updatedValue = this.value.trim(); // event.target.value.trim();

      if (event.keyCode === 13) {
        event.stopPropagation();

        if (updatedValue) {
          p.innerHTML = updatedValue; // this.value;

          parentElement.removeChild(this);

          // Update localStorage on edit
          saveTasksToLocalStorage();
        } else {
          alert("Please enter some Data");
        }
      }
    });

    parentElement.appendChild(textArea);
  });

  return editBtn;
}

// ******** Handling Mark Button ********
function handleMarkBtn(singleTask) {
  let markBtn = createNewElement({
    tag: "span",
    innerHTML: `<i class="fa-solid fa-toggle-off"></i>`,
    style: { color: "#fff", cursor: "pointer" },
  });

  markBtn.addEventListener("click", function () {
    let taskParagraph = singleTask.querySelector("p");
    let taskIcon = singleTask.querySelector("span");

    taskParagraph.classList.toggle("completed");

    if (taskParagraph.classList.contains("completed")) {
      taskIcon.innerHTML = `<i class="fa-solid fa-toggle-on"></i>`;

      singleTask.style.background = "skyblue";
    } else {
      taskIcon.innerHTML = `<i class="fa-solid fa-toggle-off"></i>`;

      singleTask.style.background = "salmon";
    }

    // Update localStorage
    saveTasksToLocalStorage();
  });

  return markBtn;
}
