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


const searchProjectByID = (projectID) => {
    return projectArray.getProjectArray()[0][projectArray.getProjectArray().findIndex((project) => project.id == projectID)];
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
    const project = projectArray.getProjectArray()[0][projectArray.getProjectArray().findIndex((project) => project.id == projectID)];
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
            checkmark.id = todo.id;
            checkmark.setAttribute("type", "checkbox");
            todoTitle.textContent = todo.title;
            // todo list must have a checklist 

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
    return {titleInputValue, todoDescriptionValue, todoDateValue, todoDescriptionValue, todoNotesValue};
}
