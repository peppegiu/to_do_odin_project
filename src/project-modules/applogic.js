import { projectArray, Project } from "./project";
import { Todo } from "./todo";

const searchProjectByID = (projectID) => {
    return projectArray.getProjectArray()[0][projectArray.getProjectArray().findIndex((project) => project.id == projectID)];
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
        projectArray.getProjectArray()[0].push(newTodo);
    }

    return { getFormData, saveFormData };
})

