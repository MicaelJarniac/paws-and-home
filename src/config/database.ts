import { Sequelize, type Options } from 'sequelize';
import { createRequire } from 'node:module';

// createRequire is Node's official escape hatch for loading CommonJS from
// ESM. We need it here because config/config.cjs MUST stay CommonJS — it's
// the same file sequelize-cli loads via its own require() call (see README
// section "Why some files are .cjs"). Using a plain ESM `import` would
// either fail outright or only expose the default export, losing the
// per-environment shape (development/test/production). createRequire keeps
// the CLI and the runtime reading a single source-of-truth config.
const require = createRequire(import.meta.url);
const allConfig = require('../../config/config.cjs') as Record<string, Options>;

const env = (process.env.NODE_ENV ?? 'development') as keyof typeof allConfig;
const config = allConfig[env];
if (!config) {
  throw new Error(`No sequelize config for NODE_ENV="${env}"`);
}

export const sequelize = new Sequelize(config);
export default sequelize;
