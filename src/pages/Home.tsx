import Island from "../Island";
import NameDisplay from "../islands/NameDisplay";
import TodoApp from "../islands/TodoApp";

export default function Home() {
	return (
		<>
			<Island src="NameDisplay.js">
				<NameDisplay initialName="Martin"></NameDisplay>
			</Island>
			<Island src="TodoApp.js">
				<TodoApp></TodoApp>
			</Island>
		</>
	)
}