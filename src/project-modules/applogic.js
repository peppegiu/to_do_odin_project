import { projectArray, Project } from "./project";
import { Todo } from "./todo";

export let selectedProject;

export const searchProjectByID = (projectID) => {
  return projectArray.getProjectArray()[0][
    projectArray
      .getProjectArray()
      .findIndex((project) => project.id == projectID)
  ];
};
export const searchTodoByID = (project, todoID) => {
  const foundTodo =
    project.todoList[project.todoList.findIndex((todo) => todo.id == todoID)];
  if (foundTodo > 0 && foundTodo) {
    return foundTodo;
  } else {
    console.log("Not found \nReturning undefined");
    return undefined;
  }
};

export const updateSelectedProject = (projectID) => {
  selectedProject = searchProjectByID(projectID);
};

export const ProjectFormHandler = (() => {
  const createProject = (formData) => {
    const project = new Project(formData.get("project-form-name"));
    return { project };
  };
  const getFormData = (formElement) => {
    const formData = new FormData(formElement);
    return formData;
  };

  const addProject = (project) => {
    projectArray.getProjectArray()[0].push(project);
  };
  return { createProject, addProject };
})();

export const todoFormHandler = () => {
  const getFormData = function (formElement) {
    const formData = new FormData(formElement);

    return formData;
  };
  const saveFormData = function (project, formData) {
    const newTodo = new Todo(
      formData.get("todo-title"),
      formData.get("todo-description-input"),
      formData.get("todo-date"),
      formData.get("todo-priority"),
      formData,
      get(todo - notes),
    );
    project.addTodo(newTodo);
  };

  return { getFormData, saveFormData };
};

export const inspector = () => {
  const copyTodoInfo = (
    todoInspectorCheckmark,
    todoInspectorTitle,
    todoInspectorDescription,
    todoInspectorPriority,
    todo,
  ) => {
    todoInspectorCheckmark = todo.checkmark;
    todoInspectorTitle = todo.title;
    todoInspectorDescription = todo.description;
    todoInspectorPriority = todo.priority;
    return {
      todoInspectorCheckmark,
      todoInspectorTitle,
      todoInspectorDescription,
      todoInspectorPriority,
    };
  };
  const saveTodoInfo = (
    todoInspectorCheckmark,
    todoInspectorTitle,
    todoInspectorDescription,
    todoInspectorPriority,
    todo,
  ) => {
    todo.checkmark = todoInspectorCheckmark;
    todo.title = todoInspectorTitle;
    todo.description = todoInspectorDescription;
    todo.priority = todoInspectorPriority;
  };
  return { copyTodoInfo, saveTodoInfo };
};
