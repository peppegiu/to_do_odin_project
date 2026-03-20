import { compareAsc } from "date-fns";
import { format } from "date-fns";
//this file is for debug purposes

export function compareDueDate(duedate) {
    const todayDate = new Date();
    const isOverDate = compareAsc(todayDate, duedate);

    return isOverDate;
}