import TodoItem from "./todoItem.js";

type ItemCounts = {
    total: number,
    incomplete: number
}
export class TodoCollection {
    private nextId: number = 1;
    private itemMap = new Map<number, TodoItem>()

    constructor(public userName: string, private todoItems: TodoItem[] = []) {
        todoItems.forEach(item => this.itemMap.set(item.id, item))
    }

    addTodo(task: string): number {
        while (this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        this.itemMap.set(this.nextId, new TodoItem(this.nextId, task))
        return this.nextId;
    }

    getTodoById(id: number): TodoItem {
        return this.itemMap.get(id);
    }

    getTodoItems(includeComplete: boolean): TodoItem[] {
        return [...this.itemMap.values()]
            .filter(item => includeComplete || !item.complete);
    }

    markComplete(id: number, complete: boolean) {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete;
        }
    }

    removeComplete(): void {
        this.itemMap.forEach((todoItem,id,map) => {
            if (todoItem.complete) {
                map.delete(id);
            }
        });
    }

    getItemCounts(): ItemCounts {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        }
    }

    printDetailsForAll(): void {
        this.itemMap.forEach((key, value) => key.printDetails())
    }
}