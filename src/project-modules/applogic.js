import { projectArray, Project } from "./project";
import Todo from "./todo";
import state from "./state";
import PubSub from "pubsub-js";
import { compareAsc } from "date-fns";
import { compareDueDate } from "./debugdateManager";

export default class Applogic {
  init() {
    PubSub.subscribe("TODO_FORM", function (msg, formData) {
      console.log(msg);
      const todo = new Todo(
        formData.get("todo-title"),
        formData.get("todo-description"),
        formData.get("todo-date"),
        formData.get("todo-priority"),
        formData.get("todo-notes"),
      );
      todo.setOverdueStatus = compareDueDate(formData.get("todo-date"))
      const selectedProject = state.getState().selectedProjectId;
      state.addTodoToProject(selectedProject, todo);
    });
  }
}


