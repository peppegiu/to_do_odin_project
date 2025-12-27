import { ProjectArray, Project } from './project-modules/project.js';
import To_do from './project-modules/todo.js'
import { CLI_interface } from './project-modules/CLI_Interface.js'


const projectArray = new ProjectArray();
let selectedProject = undefined;
const sideBar = document.querySelector(".nav-list");
const projectDisplay = document.querySelector(".project-view");
const todoForm = document.querySelector("dialog.project-todo-form");
const addTodo = document.querySelector(".addtodo-button");
const todoSubmit = document.querySelector(".todo-form-submit");
const todoDivGroup = document.getElementsByClassName("todo-element-div");
const todoInspector = document.querySelector(".todo-inspector");
const inspectorCloseBtn = document.querySelector(".close");

const searchProjectByID = (projectID) => {
    return projectArray.getProjectArray()[0][projectArray.getProjectArray().findIndex((project) => project.id == projectID)];
}
const searchTodoByID = (project, todoID) => {
    const foundTodo = project.todoList[project.todoList.findIndex((todo) => todo.id == todoID)];
    if (foundTodo > 0 && foundTodo) {
        return foundTodo;
    }
    else {
        console.log("Not found \nReturning undefined");
        return undefined;
    }
}


const projectListDOM = (function () {
    
    const displayProjectsList = function () {
        if (projectArray.isEmpty()) {
            console.log("No projects created");
        }
        else {
            for (project of projectArray.getProjectArray()[0]) {
                const projectLine = document.createElement("div");
                projectLine.id = project.id;
                projectLine.innerHTML = "<div class='circle-svg'></div>";
                projectLine.textContent += `   ${project.name}`;
            }
        }
    }
})


const displayProjectTodoList = function (projectID) {
    // make the project find
    const project = searchProjectByID(projectID);
    projectDisplay.id = projectID;
    // display the project;
    if (project < 0) {
        console.log("Not found");
    }
    else {
        selectedProject = projectID;
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
            projectDisplay.appendChild(todoElement);
        }
    }
    
}

addTodo.addEventListener("click", () => {
    todoForm.showModal();
});

todoSubmit.addEventListener("click", () => {
    const todoFormAttributes = getTodoform();
    const todo = new To_do(todoFormAttributes.titleInputValue, todoFormAttributes.todoDescriptionValue, todoFormAttributes.todoDateValue, todoFormAttributes.todoPriorityValue, todoFormAttributes.todoNotesValue);
    const project = searchProjectByID(selectedProject);
    if (project > 0 && project) {
        project.addTodo(todo);
        displayProjectTodoList(selectedProject);
    }
    else {
        console.log("Error from todoSubmit, line 75 in index.js: Todo not found");
    }
});


function getTodoform() {
    const titleInputValue = document.querySelector(".todo-title-input").value;
    const todoDescriptionValue = document.querySelector(".todo-description-input").value;
    const todoDateValue = document.querySelector(".todo-date").value;
    const todoPriorityValue = document.querySelector(".todo-priority").value;
    const todoNotesValue = document.querySelector(".todo-notes-input").value;
    return {titleInputValue, todoDescriptionValue, todoDateValue, todoPriorityValue, todoNotesValue};
}

function pasteTodoInfoToInspector(todo) {
    inspectorCloseBtn.id = todo.id;

    // Remember to change the todos elements to inputs

    // Late change the priority input to a stylized multibar (check the documentation)

    const todoInspectorCheckmark = document.querySelector(".todo-inspector-checkmark");
    const todoInspectorTitle = document.querySelector(".inspector-title");
    const todoInspectorDescription = document.querySelector(".inspector-description");
    const todoInspectorPriority = document.querySelector(".inspector-priority");
    todoInspectorCheckmark.value = todo.checkmark;
    todoInspectorTitle.textContent = todo.title;
    todoInspectorDescription.textContent = todo.description;
    todoInspectorPriority.textContent = `Priority: ${todo.priority}`;
}

todoDivGroup.addEventListener("click", (e) => {
    const todoInfo = searchTodoByID(selectedProject, e.target.id);
    if (todoInfo !== undefined) {
        pasteTodoInfoToInspector(todoInfo);
        todoInspector.showModal();
    }
    else {
        console.log("Error: A error has ocurred. Todo info has not loaded.")
    }
})

inspectorCloseBtn.addEventListener("click", () => {
    // Remember the day after to get the changed todo information and save to the new todo.
})
