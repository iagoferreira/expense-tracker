import { Hono } from 'hono';
import { logger } from 'hono/logger';
import expensesRoute from './routes/expenses';
import { serveStatic } from 'hono/serve-static';
import path from 'path';

const app = new Hono();

app.use('*', logger());

app.route('/api/expenses', expensesRoute);

app.use(
  '*',
  serveStatic({
    root: './frontend/dist',
    getContent: async (path) => {
      try {
        return await Bun.file(path).arrayBuffer();
      } catch {
        return null;
      }
    },
  })
);

app.get(
  '*',
  serveStatic({
    path: './frontend/dist/index.html',
    getContent: async (path) => {
      try {
        return await Bun.file(path).arrayBuffer();
      } catch {
        return null;
      }
    }
  })
);

export default app;
