import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import socketIOServer from './socket-io-server.js';
import { reactRenderer } from '@hono/react-renderer';
import TodoApp, { type Todo } from './components/TodoApp.js';
import { Suspense } from 'react';
import Counter from './components/Counter.js';
import Island from './islands/server.js';

const app = new Hono();

app.get('/static/*', serveStatic({ root: './' }));

app.get(
  '/*',
  reactRenderer(
    ({ children }) => {
      return (
        <html>
          <head>
            <link rel="stylesheet" href="/static/css/app.css" />
          </head>
          <body>
            <Suspense fallback={<div>Loading</div>}>{children}</Suspense>
            <script type="module" src="/static/js/build/client.js"></script>
          </body>
        </html>
      );
    },
    { docType: true, stream: true }
  )
);
app.get('/', (c) => {
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

app.get('/todos', (c) => {
  const todos: Todo[] = [
    { head: 'Milk the cow', done: false },
    { head: 'Watch Youtube', done: false },
    { head: 'Build todo app', done: false },
  ];
  return c.render(
    <Island>
      <TodoApp $todos={todos}></TodoApp>
    </Island>
  );
});

const port = 3000;
const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server started on http://localhost:${port}`);
});

socketIOServer.attach(server);
