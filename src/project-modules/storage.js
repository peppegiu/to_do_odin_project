import state from "./state";
import { Project } from "./project";
import Todo from "./todo";

class Storage {
  #isAvailable;
  #emitter = new EventTarget();

  setEvent(eventName, handler) {
    this.#emitter.addEventListener(eventName, handler);
  }

  storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }

  init() {
    if (this.storageAvailable("localStorage")) {
      this.#isAvailable = true;
      this.load();

      state.on("projectUpdated", () =>
        this.save(state.getState().projectArray),
      );

      state.on("projectListChanged", () =>
        this.save(state.getState().projectArray),
      );
    } else {
      this.#isAvailable = false;
      window.alert("Error: Local storage is not available!");
    }
  }

  load() {
    if (this.#isAvailable) {
      if (localStorage.length !== 0) {
        const key = localStorage.getItem("projectArray");
        if (!key) {
          console.log("Project not populated");
        } else {
          const projectArray = JSON.parse(key);
          for (let i = 0; i < projectArray.length; i++) {
            let projectLocalStorage = projectArray[i];
            const project = new Project(projectArray[i].name);
            for (let j = 0; j < projectLocalStorage.todoList.length; j++) {
              const todo = projectLocalStorage.todoList[j];
              const todoObject = new Todo(
                todo.title,
                todo.description,
                todo.duedate,
                todo.priority,
                todo.notes,
              );
              todoObject.checkmark = todo.checkmark;
              project.addTodo(todoObject);
            }
            state.addProject(project);
          }
          this.#emitter.dispatchEvent(
            new CustomEvent("storageLoaded", {
              detail: { projectArray: state.getState().projectArray },
            }),
          );
        }
      }
    }
  }

  save(arr) {
    if (this.#isAvailable) {
      const stringfied = JSON.stringify(arr);
      localStorage.setItem("projectArray", stringfied);
    }
  }
}

export const storage = new Storage();
