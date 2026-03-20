import { v4 as uuidv4 } from 'uuid';


export class ProjectArray {
    #projects = [];

    addProject(project) {
        this.#projects.push(project);
    }
    
    removeProject(projectID) {
        const removedProjectIndex = this.#projects.find((project) => project.id == projectID);
        if (removedProjectIndex !== undefined) {
            this.#projects.splice(removedProjectIndex, 1);
            console.log("Project removed.");
        }
        else {
            console.log("Error: project not found.");
        }
    }

    isEmpty() {
        return this.#projects.length == 0;
    }
    
    getProjectArray() {
        return [this.#projects];
    }
}

export class Project {
    constructor(name) {
        this.name = name;
    }


    id = uuidv4();
    todoList = [];
    #dueDateTodoList = [];

    get list() {
        return [...this.todoList];
    }

    addTodo(todo) {
        this.todoList.push(todo);
    }

    addTodoDueDate(todo) {
        this.#dueDateTodoList.push(todo);
    }

    removeTodo(todoID) {
        const removedTodoindex = this.todoList.find((todo) => todo.id == todoID);
        if (removedTodoindex !== undefined) {
            this.todoList.splice(removedTodoindex, 1);
            console.log("Todo removed!");
        }
        else {
            console.log("Error: not found!");
        }
        
    }


    getArrayLength() {
        return this.todoList.length;
    }
    
}

export const projectArray = new ProjectArray();