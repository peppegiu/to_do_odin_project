import { projectArray, Project } from "./project";
import {
  todoFormHandler,
  updateSelectedProject,
  selectedProject,
  searchProjectByID,
  searchTodoByID,
  inspector,
} from "./applogic";

window.addEventListener("load", () => {
    displayProjectsList();
})

const inspectorElements = {
  todoInspectorCheckmark: document.querySelector(".todo-inspector-checkmark"),
  todoInspectorTitle: document.querySelector(".inspector-title"),
  todoInspectorDescription: document.querySelector(".inspector-description"),
  todoInspectorPriority: document.querySelector(".inspector-priority"),
};
const projectLines = document.querySelectorAll(".project-line");
const projectDisplay = document.querySelector(".project-view");
const todoElement = document.querySelectorAll(".todo-element-div");

export const displayProjectsList = (DisplayElement) => {
  if (projectArray.isEmpty) {
    console.log("No projects created");
  } else {
    for (project of projectArray.getProjectArray()[0]) {
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
    todo,
  );
};

export const displayTodoList = (DisplayElement, project) => {
  for (todo of project.todoList) {
    const todoElement = document.createElement("div");
    const checkmark = document.createElement("input");
    const todoTitle = document.createElement("p");
    const todoDiv = document.createElement("div");
    todoElement.id = todo.id;
    todoDiv.id = todo.id;
    todoDiv.classList.add("todo-element-div");
    checkmark.id = todo.id;
    checkmark.setAttribute("type", "checkbox");
    todoTitle.textContent = todo.title;
    // todo list must have a checklist
    todoDiv.append(todoTitle);
    todoElement.appendChild(todoDiv);
    todoElement.appendChild(checkmark);
    DisplayElement.appendChild(todoElement);
  }
};

const DOMElement = {
  todoForm: document.getElementById("project-todo-form"),
  todoInspector: document.querySelector(".inspector-todo-content"),
};

DOMElement.todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("default prevented!");
  const formData = todoFormHandler.getFormData(event.target);
  todoFormHandler.saveFormData(selectedProject, formData);
});

projectLines.forEach((projectLine) => {
  projectLine.addEventListener("click", () => {
    updateSelectedProject(projectLine.id);
    displayTodoList(projectDisplay, searchProjectByID(projectLine.id));
  });
});

todoElement.forEach((todo) => {
  todo.addEventListener("click", (event) => {
    displayTodoInspector(
      DOMElement.todoInspector,
      searchTodoByID(selectedProject, event.target.id),
    );
  });
});

DOMElement.todoInspector.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("default prevented from todo inspector!");
  const formData = todoFormHandler.getFormData(event.target);
  inspector.saveTodoInfo(
    formData.get("todo-inspector-checkmark"),
    formData.get("inspector-title"),
    formData.get("inspector-description"),
    formData.get("inspector-priority"),
    searchTodoByID(event.target.getAttribute("todo-id")),
  );
});
