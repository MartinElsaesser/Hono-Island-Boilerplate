import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono'
import socketIOServer from './socket-io-server';


const app = new Hono()

app.get("/static/*", serveStatic({root: "./"}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 3000
const server = serve(
  { fetch: app.fetch, port },
  (info) => {
    console.log(`Listening on http://localhost:${port}`);
  }
);

socketIOServer.attach(server)

