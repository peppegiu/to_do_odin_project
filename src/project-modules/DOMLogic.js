import { projectArray, Project } from "./project";
import state from "./state.js";
import PubSub from "pubsub-js";
import Todo from "./todo.js";
import "../style.css";
import addProjectImg from "../images/addProject.png";
import addTodoImg from "../images/addTodo.png";
import Applogic from "./applogic.js";
import { storage } from "./storage.js";

const applogic = new Applogic();
applogic.init();

export class DOMlogic {
  #DOMElement = {
    todoForm: document.getElementById("project-todo-form"),
    projectFormDialog: document.querySelector(".project-form"),
    projectForm: document.querySelector("#project-form"),
    todoFormDialog: document.querySelector(".project-todo-form"),
    todoInspector: document.getElementById("todo-inspector"),
    todoInspectorDialog: document.querySelector(".todo-inspector-dialog"),
    addTodoBtn: document.querySelector(".addtodo-button"),
    addProjectBtn: document.querySelector(".addproject-button"),
    projectDisplay: document.querySelector("#project-view"),
    addProjectIcon: document.querySelector(".addProjectIcon"),
    addTodoIcon: document.querySelector(".addTodoIcon"),
    projectListElement: document.querySelector(".project-list"),
    selectedProjectInfo: document.getElementById("selected-project-info"),
    cardInput: document.getElementsByClassName(".todoCardInput"),
    todoLabel: document.getElementsByClassName(".todoLabel"),
    duedateDisplay: document.getElementById("duedateTodos"),
  };

  #todoFormDates = {
    todoFormDateID: document.querySelectorAll(".todo-date"),
  };

  #renderProjects(projects, displayElement) {
    displayElement.innerHTML = "";
    if (projects.length == 0) {
    } else {
      for (let project of projects) {
        this.#createProjectLine(project, displayElement);
      }
    }
  }

  #createTodoElement(todo, project, displayElement) {
    const todoElement = document.createElement("div");
    const checkmark = document.createElement("input");
    const todoTitle = document.createElement("p");
    const todoHeaderBoxLine = document.createElement("div");
    const todoDiv = document.createElement("div");
    const todoExpandableCard = document.createElement("div");
    const todoButton = document.createElement("button");
    const todoDeleteBtn = document.createElement("button");
    const todoButtonNav = document.createElement("div");
    const todoFormEdit = document.createElement("form");
    const todoHiddenId = document.createElement("input");
    const todoSubmit = document.createElement("button");
    const todoEdit = document.createElement("button");
    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "cancel";
    cancelBtn.hidden = true;
    todoEdit.innerText = "edit";
    todoEdit.type = "submit";
    todoSubmit.innerText = "✅";
    todoHiddenId.hidden = true;
    todoHiddenId.name = "todo-id";
    todoHiddenId.value = todo.id;
    todoTitle.classList.add("todoLabel");
    todoTitle.innerHTML += `<input class='todoCardInput' name='todo-title' value='${todo.title}'`;
    todoFormEdit.classList.add("todo-line-div");
    todoButtonNav.classList.add("todo-btn-nav");
    todoDeleteBtn.innerText = "🗑";
    todoDeleteBtn.classList.add("smallBtn");
    todoHeaderBoxLine.classList.add("boxHeader");
    checkmark.classList.add("checkmark");
    todoElement.id = todo.id;
    todoDiv.id = todo.id;
    todoDiv.classList.add("todo-div");
    todoElement.classList.add("todo-element");
    todoExpandableCard.innerHTML = `<input class="todo-title" name="todo-title" value="${todo.title}" hidden>
    <input name="todo-priority" min="1" max="5" value="${todo.priority}"><p class="todoLabel"><label for="description">Description: ${todo.description}</label> <input class="todoCardInput" name="todo-description" value="${todo.description}" hidden></p> <p class="todoLabel"><label for="due-date" c>Due date:${todo.duedate}</label> <input class="todoCardInput" name="todo-date" value="${todo.duedate}" hidden></p> <p class="todoLabel"><label for="notes" >Notes: ${todo.notes}</label> <input class="todoCardInput" name="todo-notes" value="${todo.notes}"></p>`;
    todoExpandableCard.hidden = true;
    todoExpandableCard.classList.add("todo-folding-card");
    todoButton.innerHTML = "⌄";
    checkmark.id = todo.id;
    checkmark.setAttribute("type", "checkbox");
    todoTitle.textContent = todo.title;
    // todo list must have a checklist
    todoHeaderBoxLine.append(todoTitle);
    todoHeaderBoxLine.append(checkmark);
    todoButtonNav.append(todoButton);
    todoButtonNav.append(todoDeleteBtn);
    todoButtonNav.append(cancelBtn);
    todoFormEdit.append(todoHeaderBoxLine);
    todoFormEdit.append(todoExpandableCard);
    todoFormEdit.append(todoHiddenId);
    todoFormEdit.append(todoSubmit);
    todoFormEdit.append(todoEdit);
    todoDiv.append(todoFormEdit);
    todoDiv.append(todoButtonNav);

    todoElement.appendChild(todoDiv);

    const cardInputArray = Array.from(this.#DOMElement.cardInput);
    const todoLabelArray = Array.from(this.#DOMElement.todoLabel);

    todoFormEdit.addEventListener("submit", (e) => {
      e.preventDefault();
      this.#DOMElement.todoInspectorDialog.showModal();
      const todoForm = new FormData(e.target);
      PubSub.publish("EDIT_REQUEST", todoForm);
    });

    cancelBtn.addEventListener("click", () => {
      cardInputArray.forEach((input) => {
        input.hidden = true;
      });
      cancelBtn.hidden = false;
    });

    todoDeleteBtn.addEventListener("click", () => {
      const data = {
        proj: project,
        id: todo.id,
      };
      PubSub.publish("DELETE TODO", data);
    });
    todoButton.addEventListener("click", () => {
      todoExpandableCard.hidden = !todoExpandableCard.hidden;
    });
    projectArray;

    displayElement.appendChild(todoElement);
  }

  #renderProjectTodos = (project, displayElement, dueDateDisplay) => {
    displayElement.innerHTML = "";
    dueDateDisplay.innerHTML = "";
    const projectList = project.list;

    for (let todo of projectList) {
      if (todo.getOverdueStatus < 1) {
        this.#createTodoElement(todo, project, displayElement);
      } else {
        this.#createTodoElement(todo, project, dueDateDisplay);
      }
    }
  };

  #updateselectedProjectInfo(element, info) {
    element.innerText = `${info.name} is selected with id ${info.id}`;
  }

  #hideELement(element, bool) {
    element.hidden = bool;
  }


  // quando o usuário submete um form:

  #createProjectLine(project, displayElement) {
    const projectLine = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-proj");
    deleteBtn.innerText = "❌";
    projectLine.id = project.id;
    projectLine.classList.add("project-line");
    projectLine.innerHTML = "<div class='circle-svg'></div>";
    projectLine.textContent += `   ${project.name}`;
    projectLine.append(deleteBtn);
    displayElement.appendChild(projectLine);

    deleteBtn.addEventListener("click", () => {
      PubSub.publish("PROJECT_DELETE", projectLine.id);
    });
    projectLine.addEventListener("click", (e) => {
      state.setSelectedProjectId(project.id);
    });
  }

  closeInspectorDialog() {
    this.#DOMElement.todoInspectorDialog.close();
  }

  init() {
    this.#DOMElement.projectFormDialog.addEventListener("submit", (e) => {
      this.#DOMElement.projectFormDialog.close();
    });

    this.#DOMElement.addTodoBtn.addEventListener("click", () =>
      this.#DOMElement.todoFormDialog.showModal(),
    );

    this.#DOMElement.addProjectBtn.addEventListener("click", () =>
      this.#DOMElement.projectFormDialog.showModal(),
    );
    this.#DOMElement.addProjectIcon.src = addProjectImg;
    this.#DOMElement.addTodoIcon.src = addTodoImg;

    state.on("projectListChanged", (e) => {
      const projects = e.detail.projectArray;
      this.#renderProjects(projects, this.#DOMElement.projectListElement);
    });

    state.on("selectedProjectChanged", (e) => {
      const id = e.detail.selectedProjectId;
      const project = state.getState().projectArray.find((p) => p.id === id);

      this.#renderProjectTodos(
        project,
        this.#DOMElement.projectDisplay,
        this.#DOMElement.duedateDisplay,
      );
    });

    state.on(
      "selectedProjectChanged",
      (e) => (this.#DOMElement.addTodoBtn.hidden = false),
    );

    state.on("selectedProjectChanged", (e) => {
      const id = e.detail.selectedProjectId;
      const project = state.getState().projectArray.find((p) => p.id === id);

      this.#updateselectedProjectInfo(
        this.#DOMElement.selectedProjectInfo,
        project,
      );
    });

    storage.setEvent("storageLoaded", (e) => {
      this.#renderProjects(
        e.detail.projectArray,
        this.#DOMElement.projectListElement,
      );
    });

    this.#DOMElement.projectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const project = new Project(formData.get("project-form-name"));
      state.addProject(project); // dispara evento e DOM atualiza via listener
    });

    this.#DOMElement.todoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      PubSub.publish("TODO_FORM", formData);
    });

    state.on("projectUpdated", (e) => {
      const project = e.detail.project;
      PubSub.publish("SORT_TODO", project.id);
      this.#renderProjectTodos(
        project,
        this.#DOMElement.projectDisplay,
        this.#DOMElement.duedateDisplay,
      );
    });

    PubSub.subscribe("EDIT_REQUEST", (msg, formData) => {
      const todoInspectorCheckmark = document.querySelector(
        "input.todo-inspector-checkmark",
      );
      const todoInspectorPriority = document.querySelector(
        "input.inspector-priority",
      );
      const todoInspectorTitle = document.querySelector(
        "input.inspector-title",
      );
      const todoInspectorDescription = document.querySelector(
        ".inspector-description",
      );
      const todoInspectorDate = document.querySelector("input.todo-date");
      const todoInspectorNotes = document.querySelector(
        "textarea[name='todo-notes']",
      );
      const todoInspectorID = document.querySelector("input.todo-id");

      todoInspectorPriority.value = formData.get("todo-priority");
      todoInspectorTitle.value = formData.get("todo-title");
      todoInspectorDescription.value = formData.get("todo-description");
      todoInspectorDate.value = formData.get("todo-date") || "";
      if (todoInspectorNotes) {
        todoInspectorNotes.value = formData.get("todo-notes") || "";
      }
      todoInspectorID.value = formData.get("todo-id");

      if (todoInspectorCheckmark) {
        todoInspectorCheckmark.checked =
          formData.get("todo-inspector-checkmark") === "on";
      }
    });

    this.#DOMElement.todoInspector.addEventListener("submit", (e) => {
      e.preventDefault();
      const formdata = new FormData(e.target);
      PubSub.publish("TODO_UPDATE", formdata);
      this.closeInspectorDialog();
      console.log("TODO_UPDATE pushed", Object.fromEntries(new FormData(e.target)));
    });

    state.on("projectDeleted", () => {
      this.#DOMElement.projectDisplay.innerHTML = "";
      this.#DOMElement.selectedProjectInfo.textContent = "No project selected";
    });

    this.#todoFormDates.todoFormDateID.forEach((todoInputDate) => {
      todoInputDate.min = new Date().toISOString().split("T")[0];
      todoInputDate.ariaPlaceholder = new Date().toISOString().split("T")[0];
      todoInputDate.placeholder = new Date().toISOString().split("T")[0];
    });
  }
}

// inicialização

const inspectorElements = {
  todoInspectorCheckmark: document.querySelector(".todo-inspector-checkmark"),
  todoInspectorTitle: document.querySelector(".inspector-title"),
  todoInspectorDescription: document.querySelector(".inspector-description"),
  todoInspectorPriority: document.querySelector(".inspector-priority"),
};
const projectLines = document.querySelectorAll(".project-line");
const todoElement = document.querySelectorAll(".todo-element-div");

const displayTodoButton = () => {
  this.DOMElement.addTodoBtn.setAttribute("hidden", "false");
};
