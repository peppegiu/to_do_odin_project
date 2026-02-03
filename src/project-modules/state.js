import PubSub from "pubsub-js";

const state = {
  projectArray: [],
  selectedProjectId: null,
};

const emitter = new EventTarget();

export function getState() {
  return { ...state, projectArray: { ...state.projectArray } };
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



const deleteTodo = (msg, {proj, id}) => {
  if (msg == "DELETE TODO") {
    proj.todoList.splice(proj.todoList.findIndex((todo) => todo.id == id), 1);
  }
  emitter.dispatchEvent(
    new CustomEvent("projectUpdated", { detail: { project: proj } }),
  )
}

let token = PubSub.subscribe("DELETE TODO", deleteTodo);

export function on(eventName, handler) {
  emitter.addEventListener(eventName, handler);
}


export default {
  getState,
  setSelectedProjectId,
  addProject,
  addTodoToProject,
  on,
};
