import { projectArray, Project } from "./project";
import { Todo } from "./todo";

export let selectedProject;

export const searchProjectByID = (projectID) => {
    return projectArray.getProjectArray()[0][projectArray.getProjectArray().findIndex((project) => project.id == projectID)];
}

export const updateSelectedProject = (projectID) => {
    selectedProject = searchProjectByID(projectID);
}

export const ProjectFormHandler = (() => {
    const createProject = (formData) => {
        const project = new Project(formData.get("project-form-name"));
        return { project };
    }
    const getFormData = (formElement) => {
        const formData = new FormData(formElement);
        return formData;
    }

    const addProject = (project) => {
        projectArray.getProjectArray()[0].push(project);
    }
    return { createProject, addProject };
})();

export const todoFormHandler = (() => {
    const getFormData = function (formElement) {
        const formData = new FormData(formElement)

        return formData;
    }
    const saveFormData = function (project, formData) {
        const newTodo = new Todo(formData.get("todo-title"), formData.get("todo-description-input"), formData.get("todo-date"), formData.get("todo-priority"), formData, get(todo - notes));
        project.addTodo(newTodo);
    }

    return { getFormData, saveFormData };
})

const inspector = (() => {
    const copyTodoInfo = (todo) => {
        const todoInspectorCheckmark = document.querySelector(".todo-inspector-checkmark");
        const todoInspectorTitle = document.querySelector(".inspector-title");
        const todoInspectorDescription = document.querySelector(".inspector-description");
        const todoInspectorPriority = document.querySelector(".inspector-priority");
        todoInspectorCheckmark.value = todo.checkmark;
        todoInspectorTitle.value = todo.title;
        todoInspectorDescription.value = todo.description;
        todoInspectorPriority.value = todo.priority;
    }
    const saveTodoInfo = (todo,) => {

    }
})



