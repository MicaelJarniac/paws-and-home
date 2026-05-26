import express from 'express';
import session from 'express-session';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sequelize } from './models/index.js';
import { flashMiddleware, adminLocals } from './middleware/auth.js';
import { errorMiddleware } from './middleware/errorHandler.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.PORT ?? 3000);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(PROJECT_ROOT, 'views'));

app.use(
  '/vendor/bootstrap',
  express.static(path.join(PROJECT_ROOT, 'node_modules', 'bootstrap', 'dist')),
);
app.use(express.static(path.join(PROJECT_ROOT, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'paws-and-home-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 4 },
  }),
);

app.use(flashMiddleware);
app.use(adminLocals);

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

app.use(errorMiddleware);

try {
  await sequelize.authenticate();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
  });
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Unable to connect to the database:', err);
  process.exit(1);
}
