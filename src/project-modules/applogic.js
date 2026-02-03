import { projectArray, Project } from "./project";
import Todo from "./todo";
import state from "./state";
import PubSub from "pubsub-js";

export let selectedProject;

PubSub.subscribe("TODO_FORM", function (msg, formData) {
  console.log(msg);
  const todo = new Todo(
    formData.get("todo-title"),
    formData.get("todo-description"),
    formData.get("todo-date"),
    formData.get("todo-priority"),
    formData.get("todo-notes"),
  );
  const selectedProject = state.getState().selectedProjectId;
  state.addTodoToProject(selectedProject, todo);
});
