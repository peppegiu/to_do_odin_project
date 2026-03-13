import { projectArray, Project } from "./project";
import state from "./state.js";
import PubSub from "pubsub-js";
import Todo from "./todo.js";
import "../style.css";
import addProjectImg from "../images/addProject.png";
import addTodoImg from "../images/addTodo.png";
import Applogic from "./applogic.js";

const applogic = new Applogic();
applogic.init();

export default class DOMlogic {
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
  };

  #todoFormDates = {
    todoFormDateID: document.querySelector(".todo-date"),

  }

  #renderProjects(projects, displayElement) {
    displayElement.innerHTML = "";
    console.log("Projects:" + projects);
    if (projects.length == 0) {
      console.log("No projects created");
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
    todoDiv.classList.add("todo-div")
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

    todoFormEdit.addEventListener("submit", (e) => {
      const formData = new FormData(e.target);

      PubSub.publish("TODO_UPDATED", formData);
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

  #renderProjectTodos = (project, displayElement) => {
    displayElement.innerHTML = "";

    for (let todo of project.todoList) {
      this.#createTodoElement(todo, project, displayElement);
    }
  };

  #updateselectedProjectInfo(element, info) {
    element.innerText = `${info.name} is selected with id ${info.id}`;
  }

  #hideELement(element, bool) {
    element.hidden = bool;
  }

  #validadeDate() {
    const date = new Date(document.forms["todo-form"]["todo-date"].value);
    Pubsub.publish("VALIDATE_DATE", date);
    const todayDate = new Date()
  }

  // quando o usuário submete um form:

  #createProjectLine(project, displayElement) {
    console.log("Project:" + project);
    const projectLine = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-proj");
    deleteBtn.innerText="❌";
    projectLine.id = project.id;
    projectLine.classList.add("project-line");
    projectLine.innerHTML = "<div class='circle-svg'></div>";
    projectLine.textContent += `   ${project.name}`;
    projectLine.append(deleteBtn);
    displayElement.appendChild(projectLine);

    deleteBtn.addEventListener("click", () => {
      PubSub.publish("PROJECT_DELETE", projectLine.id);
    })
    projectLine.addEventListener("click", (e) => {
      console.log("Array: " + [].constructor);
      console.log("Projectarray: " + state.getState().projectArray.constructor);
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
      console.log(projects);
      this.#renderProjects(projects, this.#DOMElement.projectListElement);
    });

    state.on("selectedProjectChanged", (e) => {
      console.log("Event is working 2!");
      const id = e.detail.selectedProjectId;
      const project = state.getState().projectArray.find((p) => p.id === id);

      this.#renderProjectTodos(project, this.#DOMElement.projectDisplay);
    });

    state.on(
      "selectedProjectChanged",
      (e) => (this.#DOMElement.addTodoBtn.hidden = false),
    );

    state.on("selectedProjectChanged", (e) => {
      console.log("Event is working!");
      const id = e.detail.selectedProjectId;
      const project = state.getState().projectArray.find((p) => p.id === id);

      this.#updateselectedProjectInfo(
        this.#DOMElement.selectedProjectInfo,
        project,
      );
    });

    this.#DOMElement.projectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      console.log(formData);
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
      this.#renderProjectTodos(project, this.#DOMElement.projectDisplay);
    });

    PubSub.subscribe("EDIT_REQUEST", (msg, formData) => {
      const todoInspectorForm = this.#DOMElement.todoInspector;
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
      const todoInspectorID = document.querySelector("input.todo-id");
      todoInspectorPriority.value = formData.get("todo-priority");
      todoInspectorTitle.value = formData.get("todo-title");
      todoInspectorDescription.value = formData.get("todo-description");
      todoInspectorID.value = formData.get("todo-id");
    });

    this.#DOMElement.todoInspector.addEventListener("submit", (e) => {
      e.preventDefault();
      const formdata = new FormData(e.target);
      PubSub.publish("TODO_UPDATE", formdata);
      this.closeInspectorDialog();
    });

    state.on("projectDeleted", () => {
      this.#DOMElement.projectDisplay.innerHTML = "";
      this.#DOMElement.selectedProjectInfo.textContent = "No project selected";
    })
    
    this.#todoFormDates.todoFormDateID.min = new Date().toISOString().split("T")[0];
    this.#todoFormDates.todoFormDateID.ariaPlaceholder = new Date().toISOString().split(T)[0];
    this.#todoFormDates.todoFormDateID.placeholder = new Date().toISOString().split(T)[0];
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
