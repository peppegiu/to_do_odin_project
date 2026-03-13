import PubSub from "pubsub-js";
import { projectArray } from "./project";
import { compareAsc } from "date-fns";

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
    proj.todoList.push(todo);
    emitter.dispatchEvent(
      new CustomEvent("projectUpdated", { detail: { project: proj } }),
    );
  }
}

const deleteTodo = (msg, { proj, id }) => {
  if (msg == "DELETE TODO") {
    proj.todoList.splice(
      proj.todoList.findIndex((todo) => todo.id == id),
      1,
    );
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
  const proj = state.projectArray.find(
    (proj) => proj.id == state.selectedProjectId,
  );
  console.log(formData.get("todo-id"));

  const todo = proj.todoList.find((task) => task.id == formData.get("todo-id"));

  todo.properties = {
    title: formData.get("todo-title"),
    description: formData.get("todo-description"),
    duedate: formData.get("todo-date"),
    notes: formData.get("todo-notes"),
  };

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


export default {
  getState,
  setSelectedProjectId,
  addProject,
  addTodoToProject,
  on,
};
