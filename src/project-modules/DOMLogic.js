import { projectArray, Project } from "./project";
import {
  projectFormHandler,
  updateSelectedProject,
  selectedProject,
  searchProjectByID,
  searchTodoByID,
  inspector,
} from "./applogic";
import state from "./state.js";
import PubSub from "pubsub-js";
import Todo from "./todo.js";

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

function renderProjects (projects) {
  console.log("Projects:" + projects);
  if (projects.length == 0) {
    console.log("No projects created");
  } else {
    for (let project of projects) {
      createProjectLine(project);
    }
  }
};

// inicialização
state.on("projectListChanged", (e) => {
  const projects = e.detail.projectArray;
  console.log(projects);
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
  console.log(formData);
  const project = new Project(formData.get("project-form-name"));
  state.addProject(project); // dispara evento e DOM atualiza via listener
});

DOMElement.todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(e.target);
  PubSub.publish("TODO_FORM", formData);
});

state.on("projectUpdated", (e) => {
  const project = e.detail.project;
  renderProjectTodos(project);
});

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
  todoExpandableCard.innerHTML = `<p>${todo.description}</p> <p>${todo.duedate}</p> <p>${todo.notes}</p>`;
  todoExpandableCard.style.visibility = false;
  checkmark.id = todo.id;
  checkmark.setAttribute("type", "checkbox");
  todoTitle.textContent = todo.title;
  // todo list must have a checklist
  todoDiv.append(todoTitle);
  todoDiv.append(todoExpandableCard);
  todoDiv.append(todoButton);
  todoElement.appendChild(todoDiv);
  todoElement.appendChild(checkmark);

  todoDeleteBtn.addEventListener("click", () => {
    const data = {
      proj: project,
      id: todo.id,
    };
    PubSub.publish("DELETE TODO", data);
  });
  todoButton.addEventListener("click", () => {
    todoExpandableCard.style.visibility = true;
  });

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



function createProjectLine(project) {
  console.log("Project:" +project);
  const projectLine = document.createElement("div");
  projectLine.id = project.id;
  projectLine.classList.add("project-line");
  projectLine.innerHTML = "<div class='circle-svg'></div>";
  projectLine.textContent += `   ${project.name}`;
  DisplayElement.appendChild(projectLine);

  projectLine.addEventListener("click", (e) => {
    const proj = state.getState().projectArray.find((p) => p.id === project.id);
    renderProjectTodos(proj);
  });
}

export const renderProjectTodos = (project) => {
  DisplayElement.innerHTML = "";

  for (todo of project.todoList) {
    createTodoElement(todo, project);
  }
};

DOMElement.addTodoBtn.addEventListener("click", () =>
  DOMElement.todoFormDialog.showModal(),
);

DOMElement.addProjectBtn.addEventListener("click", () =>
  DOMElement.projectFormDialog.showModal(),
);

projectLines.forEach((projectLine) => {
  projectLine.addEventListener("click", () => {});
});

const displayTodoButton = () => {
  DOMElement.addTodoBtn.setAttribute("hidden", "false");
};


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
