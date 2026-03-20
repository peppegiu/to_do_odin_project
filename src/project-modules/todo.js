import { v4 as uuidv4 } from "uuid";

export default class Todo {
  constructor(title, description, duedate, priority, notes) {
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;
    this.notes = notes;
  }
  #overdue = null;

  get getOverdueStatus() {
    return this.#overdue;
  }

  set setOverdueStatus(number) {
    this.#overdue = number;
  }

  id = uuidv4();

  checkmark = false;

  subTasks = [];

  set properties({ title, description, duedate, priority, notes, checkmark }) {
    if (title !== undefined) this.title = title;
    if (description !== undefined) this.description = description;
    if (duedate !== undefined) this.duedate = duedate;
    if (priority !== undefined) this.priority = priority;
    if (notes !== undefined) this.notes = notes;
    if (checkmark !== undefined) this.checkmark = Boolean(checkmark);
  }

  addSubTask(subTask) {
    this.subTasks.push(subTask);
  }

  getId() {
    return this.id;
  }

  changeCheckMark() {
    if (this.checkmark == false) {
      this.checkmark = true;
    } else {
      this.checkmark = false;
    }
  }

  changeTitle(newTitle) {
    this.title = newTitle;
  }

  changeDescription(newDescription) {
    this.description = newDescription;
  }

  changePriority(newPriority) {
    this.priority = newPriority;
  }

  changeNotes(newNotes) {
    this.notes = newNotes;
  }
}
