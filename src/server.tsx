import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import socketIOServer from './socket-io-server.js';
import { reactRenderer } from '@hono/react-renderer';
import Island from './Island.js';
import TodoApp from './components/TodoApp.js';
import type { Todo } from './components/TodoApp.js';
import islands from './islands/islands.js';
import { Suspense } from 'react';
import Counter from './components/Counter.js';

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
            <script type="module" src="/static/js/hydrate.mjs"></script>
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
        <Counter initialCount={4}></Counter>
      </Island>
      <h2>Counter 2</h2>
      <Island>
        <Counter initialCount={2}></Counter>
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
      <TodoApp _todos={todos}></TodoApp>
    </Island>
  );
});

const port = 3000;
const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server started on http://localhost:${port}`);
});

socketIOServer.attach(server);
