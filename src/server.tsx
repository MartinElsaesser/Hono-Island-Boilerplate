import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono'
import socketIOServer from './socket-io-server';
import Home from './pages/Home';
import { jsxRenderer } from 'hono/jsx-renderer';
import Island from './Island';
import TodoApp from './islands/TodoApp';
import type { Todo } from './islands/TodoApp';

const app = new Hono()

app.get("/static/*", serveStatic({ root: "./" }))

app.get(
	'/*',
	jsxRenderer(({ children }) => {
		return (
			<html>
				<head>
					<link rel="stylesheet" href="/static/css/app.css" />
				</head>
				<body>
					{children}
					<script type="module" src="/static/js/hydrate.mjs"></script>
				</body>
			</html>
		)
	})
)
app.get('/', (c) => {
	const todos: Todo[] = [
		{head: "Milk the cow", done: false},
		{head: "Watch Youtube", done: false},
		{head: "Build todo app", done: false},
	]
	return c.render(
		<Island src='TodoApp.js'>
			<TodoApp _todos={todos}></TodoApp>
		</Island>
	)
});

const port = 3000
const server = serve(
	{ fetch: app.fetch, port },
	(info) => {
		console.log(`Server started on http://localhost:${port}`);
	}
);

socketIOServer.attach(server)

