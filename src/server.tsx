import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import socketIOServer from "./socket-io-server.js";
import { reactRenderer } from "@hono/react-renderer";
import TodoApp, { type Todo } from "./components/TodoApp.js";
import Counter from "./components/Counter.js";
import { Island } from "./lib/islands/index.js";
import {
	TestCounter1,
	TestCounter2,
	TestCounter3,
	TestCounter4,
	TestCounter5,
	TestCounter6,
	TestCounter7,
	TestCounter8,
} from "./components/TestComponents.js";

const app = new Hono();

app.get("/static/*", serveStatic({ root: "./" }));

app.get(
	"/*",
	reactRenderer(
		({ children }) => {
			return (
				<html>
					<head>
						<link rel="stylesheet" href="/static/css/app.css" />
					</head>
					<body>{children}</body>
				</html>
			);
		},
		{ docType: true }
	)
);
app.get("/", c => {
	return c.render(
		<>
			<h2>Counter 1</h2>
			<Island>
				<Counter $count={4}></Counter>
			</Island>
			<h2>Counter 2</h2>
			<Island>
				<Counter $count={2}></Counter>
			</Island>
		</>
	);
});

app.get("/test-components", c => {
	return c.render(
		<>
			<h2>Test Counter 1</h2>
			<Island>
				<TestCounter1></TestCounter1>
			</Island>
			<h2>Test Counter 2</h2>
			<Island>
				<TestCounter2></TestCounter2>
			</Island>
			<h2>Test Counter 3</h2>
			<Island>
				<TestCounter3></TestCounter3>
			</Island>
			<h2>Test Counter 4</h2>
			<Island>
				<TestCounter4></TestCounter4>
			</Island>
			<h2>Test Counter 5</h2>
			<Island>
				<TestCounter5></TestCounter5>
			</Island>
			<h2>Test Counter 6</h2>
			<Island>
				<TestCounter6></TestCounter6>
			</Island>
			<h2>Test Counter 7</h2>
			<Island>
				<TestCounter7></TestCounter7>
			</Island>
			<h2>Test Counter 8</h2>
			<Island>
				<TestCounter8></TestCounter8>
			</Island>
			<h2>Counter</h2>
			<Island>
				<Counter $count={10}></Counter>
			</Island>
		</>
	);
});

app.get("/todos", c => {
	const todos: Todo[] = [
		{ head: "Milk the cow", done: false },
		{ head: "Watch Youtube", done: false },
		{ head: "Build todo app", done: false },
	];
	return c.render(
		<Island>
			<TodoApp $todos={todos}></TodoApp>
		</Island>
	);
});

const port = 3000;
const server = serve({ fetch: app.fetch, port }, info => {
	console.log(`Server started on http://localhost:${port}`);
});

socketIOServer.attach(server);
