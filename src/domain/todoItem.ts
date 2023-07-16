import {TodoCollection} from "./todoCollection.js";

export default class TodoItem {
    constructor(public id: number, public task: string, public complete = false) {
    }

    printDetails(): void {
        console.log(`${this.id}\t${this.task} ${this.complete ? "\t(complete)": ""}`)
    }
}