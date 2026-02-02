import { projectArray, Project } from './project-modules/project.js';
import To_do from './project-modules/todo.js'




let selectedProject = undefined;
const sideBar = document.querySelector(".nav-list");

const addTodo = document.querySelector(".addtodo-button");
const todoForm = document.getElementById("project-todo-form");
const todoDivGroup = document.querySelectorAll(".todo-element-div");
const todoInspector = document.querySelector(".todo-inspector");
const inspectorCloseBtn = document.querySelector(".close");
const addProjectButton = document.querySelector(".project-form-name");





 