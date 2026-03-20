import { projectArray, Project } from "./project-modules/project.js";
import To_do from "./project-modules/todo.js";
import {DOMlogic} from "./project-modules/DOMLogic.js";
import { storage } from "./project-modules/storage.js";

const Domlogic = new DOMlogic();

Domlogic.init();
storage.init();

