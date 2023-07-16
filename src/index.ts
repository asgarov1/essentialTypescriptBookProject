import TodoItem from "./domain/todoItem.js";
import inquirer from "inquirer";
import {JsonTodoCollection} from "./domain/jsonTodoCollection.js";

let todos = [
    new TodoItem(1, "Buy Flowers"),
    new TodoItem(2, "Get Shoes"),
    new TodoItem(3, "Collect Tickets"),
    new TodoItem(4, "Call Joe", true),
]

let collection = new JsonTodoCollection("Adam", todos)
let showCompleted = true;

function displayTodoList(): void {
    console.log(`${collection.userName}'s Todo List `
        + `(${collection.getItemCounts().incomplete} items to do)`);
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

console.clear()
console.log(`${collection.userName}'s Todo List `
    + `(${collection.getItemCounts().incomplete} items to do)`);

enum Commands {
    Add = "Add New Task",
    Complete = "Complete Task",
    Toggle = "Show/Hide Complete",
    Purge = "Remove Completed Tasks",
    Quit = "Quit"
}

function promptComplete(): void {
    console.clear();
    inquirer.prompt({
        type: "checkbox", name: "complete",
        message: "Mark Tasks Complete",
        choices: collection.getTodoItems(showCompleted).map(item =>
            ({name: item.task, value: item.id, checked: item.complete}))
    }).then(answers => {
        let completedTasks = answers["complete"] as number[];
        collection.getTodoItems(true).forEach(item =>
            collection.markComplete(item.id,
                completedTasks.find(id => id === item.id) != undefined));
        promptUser();
    })
}

function promptAdd(): void {
    console.clear();
    inquirer.prompt({type: "input", name: "add", message: "Enter task:"})
        .then(answers => {
            if (answers["add"] !== "") {
                collection.addTodo(answers["add"]);
            }
            promptUser();
        })
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    console.log()
    inquirer.prompt({
        type: "list",
        name: "command",
        message: "choose option",
        choices: Object.values(Commands),
    }).then(answers => {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd()
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplete()
                } else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete()
                promptUser()
                break;
        }
    })
}

promptUser()