import { projectArray, Project } from "./project";
import {
  todoFormHandler,
  projectFormHandler,
  updateSelectedProject,
  selectedProject,
  searchProjectByID,
  searchTodoByID,
  inspector,
} from "./applogic";
import state from "./state.js";
import PubSub from "pubsub-js";

const DOMElement = {
  todoForm: document.getElementById("project-todo-form"),
  projectFormDialog: document.querySelector(".project-form"),
  projectForm: document.querySelector("#project-form"),
  todoFormDialog: document.querySelector(".project-todo-form"),
  todoInspector: document.querySelector("#todo-inspector"),
  todoInspectorDialog: document.querySelector(".todo-inspector-dialog"),
  addTodoBtn: document.querySelector(".addtodo-button"),
  addProjectBtn: document.querySelector(".addproject-button"),
  projectDisplay: document.querySelector(".project-view"),
};


const DisplayElement = document.querySelector("#project-view");

// inicialização
state.on("projectListChanged", (e) => {
  const projects = e.detail.projectArray;
  renderProjects(projects);
});

state.on("selectedProjectChanged", (e) => {
  const id = e.detail.selectedProjectId;
  const project = state.getState().projectArray.find((p) => p.id === id);
  renderProjectTodos(project);
});

// quando o usuário submete um form:
DOMElement.projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const project = new Project(formData.get("project-form-name"));
  state.addProject(project); // dispara evento e DOM atualiza via listener
});

state.on("projectUpdated", (e) => {
  const project = e.detail.project;
  renderProjectTodos(project);
})

function createTodoElement(todo, project) {
  const todoElement = document.createElement("div");
  const checkmark = document.createElement("input");
  const todoTitle = document.createElement("p");
  const todoDiv = document.createElement("div");
  const todoExpandableCard = document.createElement("div");
  const todoButton = document.createElement("button");
  const todoDeleteBtn = document.createElement("button");
  todoDeleteBtn.innerText = "Delete";
  todoElement.id = todo.id;
  todoDiv.id = todo.id;
  todoDiv.classList.add("todo-element-div");
  todoExpandableCard.innerHTML = `<p>${todo.description}</p> <p>${todo.duedate}</p> <p>${todo.notes}</p>`
  todoExpandableCard.style.visibility = false;
  checkmark.id = todo.id;
  checkmark.setAttribute("type", "checkbox");
  todoTitle.textContent = todo.title;
  // todo list must have a checklist
  todoDiv.append(todoTitle);
  todoDiv.append(todoExpandableCard);
  todoDiv.append(todoButton)
  todoElement.appendChild(todoDiv);
  todoElement.appendChild(checkmark);
  
  todoDeleteBtn.addEventListener("click", () => {
    const data = {
      proj: project,
      id: todo.id,
    }
    PubSub.publish("DELETE TODO", data);
  })
  todoButton.addEventListener("click", () => {todoExpandableCard.style.visibility = true});


  DisplayElement.appendChild(todoElement);
}

const inspectorElements = {
  todoInspectorCheckmark: document.querySelector(".todo-inspector-checkmark"),
  todoInspectorTitle: document.querySelector(".inspector-title"),
  todoInspectorDescription: document.querySelector(".inspector-description"),
  todoInspectorPriority: document.querySelector(".inspector-priority"),
};
const projectLines = document.querySelectorAll(".project-line");
const projectDisplay = document.querySelector(".project-view");
const todoElement = document.querySelectorAll(".todo-element-div");

export const renderProjects = (project) => {
  const projectCopy = state.getState();
  if (projectCopy.projectArray.length == 0) {
    console.log("No projects created");
  } else {
    for (project of projectCopy.projectArray) {
      const projectLine = document.createElement("div");
      projectLine.id = project.id;
      projectLine.classList.add("project-line");
      projectLine.innerHTML = "<div class='circle-svg'></div>";
      projectLine.textContent += `   ${project.name}`;
      DisplayElement.appendChild(projectLine);
    }
  }
};

const displayTodoInspector = (DisplayElement, todo) => {
  DisplayElement.setAttribute("todo-id", todo.id);
  inspector.copyTodoInfo(
    inspectorElements.todoInspectorCheckmark,
    inspectorElements.todoInspectorTitle,
    inspectorElements.todoInspectorDescription,
    inspectorElements.todoInspectorPriority,
  );
};

export const renderProjectTodos = (project) => {
  DisplayElement.innerHTML = "";

  for (todo of project.todoList) {
    createTodoElement(todo, project);
  }
};

DisplayElement.addEventListener("click", (e) => {
  if (e.target.classList.contains("expand")) {
    const todoId = e.target.dataset.todo - id;
  }
})


DOMElement.addTodoBtn.addEventListener("click", () =>
  DOMElement.todoFormDialog.showModal(),
);

DOMElement.addProjectBtn.addEventListener("click", () =>
  DOMElement.projectFormDialog.showModal(),
);


projectLines.forEach((projectLine) => {
  projectLine.addEventListener("click", () => {
    updateSelectedProject(projectLine.id);
    displayTodoList(projectDisplay, searchProjectByID(projectLine.id));
    displayTodoButton();
  });
});

const displayTodoButton = () => {
  DOMElement.addTodoBtn.setAttribute("hidden", "false");
};

todoElement.forEach((todo) => {
  todo.addEventListener("click", (event) => {
    displayTodoInspector(
      DOMElement.todoInspector,
      searchTodoByID(selectedProject, event.target.id),
    );
  });
});

DOMElement.todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  todoFormHandler(event.target, selectedProject);
});

//  DOMElement.todoInspector.addEventListener("submit", (event) => {
//    event.preventDefault();
//    console.log("default prevented from todo inspector!");
//    const formData = todoFormHandler.getFormData(event.target);
//    inspector.saveTodoInfo(
/*      formData.get("todo-inspector-checkmark"),
      formData.get("inspector-title"),
      formData.get("inspector-description"),
      formData.get("inspector-priority"),
      searchTodoByID(event.target.getAttribute("todo-id")),
    );
    DOMElement.todoInspectorDialog.close();
  });

window.addEventListener("load", () => {
  displayProjectsList(projectDisplay);
});
*/