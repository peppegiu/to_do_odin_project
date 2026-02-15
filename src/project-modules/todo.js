import { v4 as uuidv4 } from 'uuid';

export default class Todo {
  constructor(title, description, duedate, priority, notes) {
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.priority = priority;
    this.notes = notes;
  }
  id = uuidv4();

  checkmark = false;

  subTasks = [];

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
