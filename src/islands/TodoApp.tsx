import { useState } from "hono/jsx";
import { useInput } from "../lib/useInput";

export type Todo = {
	head: string,
	done: boolean,
}

export default function TodoApp({_todos}: {_todos: Todo[]}) {
	const inputTodo = useInput("");
	const [todos, setTodos] = useState<Todo[]>(_todos);
	
	function handleAddTodo(event: MouseEvent): void {
		if(inputTodo.value.length < 1) return;
		const newTodo = {head: inputTodo.value, done: false}
		setTodos([...todos, newTodo]);
	}

	function handleDeleteTodo(idx: number) {
		setTodos([...todos.slice(0, idx), ...todos.slice(idx+1)])
	}

	return (
		<div>
			<h1>Todos</h1>
			<div>
				<input type="text" {...inputTodo}/>
				<button onClick={handleAddTodo}>Add Todo</button>
				<button>Save to DB</button>
			</div>
			<ul>
				{todos.map((todo, i) => <TodoItem {...todo} onDelete={() => handleDeleteTodo(i)}/>)}
			</ul>
		</div>
	)
}

function TodoItem({head, done, onDelete}: Todo & { onDelete: () => void}) {
	return (
		<li>
			<span>{head}</span>
			<button onClick={onDelete}>del</button>
		</li>
	)
}