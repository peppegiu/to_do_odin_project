import { projectArray, Project } from './project-modules/project.js';
import To_do from './project-modules/todo.js'




let selectedProject = undefined;
const sideBar = document.querySelector(".nav-list");
const projectDisplay = document.querySelector(".project-view");
const todoForm = document.querySelector("dialog.project-todo-form");
const addTodo = document.querySelector(".addtodo-button");
const todoForm = document.getElementById("project-todo-form");
const todoDivGroup = document.querySelectorAll(".todo-element-div");
const todoInspector = document.querySelector(".todo-inspector");
const inspectorCloseBtn = document.querySelector(".close");
const addProjectButton = document.querySelector(".project-form-name");

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
                projectDisplay.appendChild(projectLine);
            }
        }
    }

const projectForm = function () {
    

}

addProjectButton.addEventListener("click",) //incomplete

const getProjectFormName = function () {
    const projectFormName = document.querySelector(".project-form-name").value;
    
    return projectFormName;
}

const createProject = function () {
    const formName = getProjectFormName();
    const newProject = new Project(formName);
    projectArray.addProject(newProject);
}

window.addEventListener("load", () => {
    displayProjectsList();
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

todoSubmit.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log('Form submission prevented. Handling with JavaScript instead.');
    const todoFormAttributes = getTodoform();
    const todo = new To_do(todoFormAttributes.titleInputValue, todoFormAttributes.todoDescriptionValue, todoFormAttributes.todoDateValue, todoFormAttributes.todoPriorityValue, todoFormAttributes.todoNotesValue);
    const project = searchProjectByID(selectedProject);
    if (project > 0 && project) {
        project.addTodo(todo);
        displayProjectTodoList(selectedProject);
    }
    else {
        console.log("Error from todoSubmit: Project not found");
    }
    todoForm.close();
});


function getTodoform() {
    const titleInputValue = document.querySelector("#todo-title-input").value;
    const todoDescriptionValue = document.querySelector("#todo-description-input").value;
    const todoDateValue = document.querySelector(".todo-date").value;
    const todoPriorityValue = document.querySelector(".todo-priority").value;
    const todoNotesValue = document.querySelector(".todo-notes-input").value;
    return {titleInputValue, todoDescriptionValue, todoDateValue, todoPriorityValue, todoNotesValue};
}

function getTodoInspectorInfo() {
    const todoInspectorCheckmark = document.querySelector(".todo-inspector-checkmark");
    const todoInspectorTitle = document.querySelector(".inspector-title");
    const todoInspectorDescription = document.querySelector(".inspector-description");
    const todoInspectorPriority = document.querySelector(".inspector-priority");
    return {todoInspectorCheckmark, todoInspectorTitle, todoInspectorDescription, todoInspectorPriority};
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
    todoInspectorTitle.value = todo.title;
    todoInspectorDescription.value = todo.description;
    todoInspectorPriority.value = todo.priority;
}

// This code toggles a todo new tab with more details and enables edit too.
todoDivGroup.forEach((todoDiv) => {
    todoDiv.addEventListener("click", (e) => {
        const todoInfo = searchTodoByID(selectedProject, e.target.id);
        if (todoInfo !== undefined) {
            pasteTodoInfoToInspector(todoInfo);
            todoInspector.showModal();
        }
        else {
            console.log("Error: A error has ocurred. Todo info has not loaded.")
        }
    })
})


const saveToTodo = (todo, infoObject) => {
    todo.title = infoObject.todoInspectorTitle;
    todo.description = infoObject.todoDescriptionValue;
    todo.priority = infoObject.todoInspectorPriority;
    todo.checkmark = infoObject.todoInspectorCheckmark
}

inspectorCloseBtn.addEventListener("click", (e) => {
    // Remember the day after to get the changed todo information and save to the new todo.
    const todoInfo = getTodoInspectorInfo();
    const todo = searchProjectByID(e.target.id);

    if (todo) {
        saveToTodo(todo, todoInfo);
        todoInspector.close();
    }
    else {
        console.log("Error.")
    }
})
