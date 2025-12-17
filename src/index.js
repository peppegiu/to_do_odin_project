import { ProjectArray, Project } from './project-modules/project.js';
import To_do from './project-modules/todo.js'
import { CLI_interface } from './project-modules/CLI_Interface.js'


const projectArray = new ProjectArray();
let selectedProject = undefined;
const sideBar = document.querySelector(".nav-list");
const projectDisplay = document.querySelector(".project-view");

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

const form