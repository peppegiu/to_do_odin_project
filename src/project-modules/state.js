import PubSub from "pubsub-js";
import { projectArray } from "./project";
import { compareAsc } from "date-fns";
import { compareDueDate } from "./debugdateManager";
import { storage } from "./storage";

const state = {
  projectArray: [],
  selectedProjectId: null,
};

const emitter = new EventTarget();

export function getState() {
  return { ...state, projectArray: [...state.projectArray] };
}

export function setSelectedProjectId(id) {
  state.selectedProjectId = id;
  emitter.dispatchEvent(
    new CustomEvent("selectedProjectChanged", {
      detail: { selectedProjectId: id },
    }),
  );
}

export function addProject(project) {
  state.projectArray.push(project);
  emitter.dispatchEvent(
    new CustomEvent("projectListChanged", {
      detail: { projectArray: [...state.projectArray] },
    }),
  );
}

export function addTodoToProject(projectId, todo) {
  const proj = state.projectArray.find((p) => p.id === projectId);
  if (proj) {
    proj.addTodo(todo);
    emitter.dispatchEvent(
      new CustomEvent("projectUpdated", { detail: { project: proj } }),
    );
  }
}

const deleteTodo = (msg, { proj, id }) => {
  if (msg == "DELETE TODO") {
    proj.removeTodo(id);
  }
  emitter.dispatchEvent(
    new CustomEvent("projectUpdated", { detail: { project: proj } }),
  );
};

let token = PubSub.subscribe("DELETE TODO", deleteTodo);

export function on(eventName, handler) {
  emitter.addEventListener(eventName, handler);
}

PubSub.subscribe("TODO_UPDATE", function (msg, formData) {
  console.log("TODO_UPDATE received", formData.get("todo-date"))
  const proj = state.projectArray.find(
    (proj) => proj.id == state.selectedProjectId,
  );

  const todo = proj.list.find((task) => task.id == formData.get("todo-id"));

  todo.properties = {
    title: formData.get("todo-title"),
    description: formData.get("todo-description"),
    duedate: formData.get("todo-date"),
    priority:
      formData.get("inspector-priority") || formData.get("todo-priority"),
    notes: formData.get("todo-notes"),
    checkmark: formData.get("todo-inspector-checkmark"),
  };

  todo.setOverdueStatus = compareDueDate(formData.get("todo-date"));
  console.log("TODO_UPDATE done:  " + todo.title, todo.duedate);

  emitter.dispatchEvent(
    new CustomEvent("projectUpdated", { detail: { project: proj } }),
  );
});

PubSub.subscribe("PROJECT_DELETE", (msg, id) => {
  state.projectArray.splice(
    state.projectArray.find((project) => project.id == id),
    1,
  );
  state.selectedProjectId = null; //Evita bugs caso o projeto selecionado seja o deletado.
  emitter.dispatchEvent(new CustomEvent("projectDeleted"));
  emitter.dispatchEvent(
    new CustomEvent("projectListChanged", {
      detail: { projectArray: [...state.projectArray] },
    }),
  );
});

PubSub.subscribe("SORT_TODO", (msg, projectId) => {
  const proj = state.projectArray.find((p) => p.id === projectId);
  for (let todo of proj.list) {
    todo.setOverdueStatus = compareDueDate(todo.duedate);
  }
});

export default {
  getState,
  setSelectedProjectId,
  addProject,
  addTodoToProject,
  on,
};
