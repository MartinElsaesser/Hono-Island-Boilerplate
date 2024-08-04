import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono'
import socketIOServer from './socket-io-server';
import Home from './pages/Home';
import { jsxRenderer } from 'hono/jsx-renderer';


const app = new Hono()

app.get("/static/*", serveStatic({ root: "./" }))

app.get(
	'/*',
	jsxRenderer(({ children }) => {
		return (
			<html>
				<body>
					{children}
					<script type="module" src="/static/js/hydrate.mjs"></script>
				</body>
			</html>
		)
	})
)
app.get('/', (c) => {
	return c.render(<Home></Home>)
})

const port = 3000
const server = serve(
	{ fetch: app.fetch, port },
	(info) => {
		console.log(`Listening on http://localhost:${port}`);
	}
);

socketIOServer.attach(server)

