// MUST stay .cjs — sequelize-cli v6 loads this via require() (CJS only).
// package.json declares "type": "module", so a .js extension would force
// ESM parsing and break with "module is not defined in ES module scope".
// src/config/database.ts also reads this file via createRequire() so the
// runtime and the CLI share a single source of truth. See README
// "Why some files are .cjs" for details.
// Tracking native ESM support: https://github.com/sequelize/cli/issues/1436

// CJS import — required by the file's CommonJS contract (see header above).
const path = require('path');

// seederStorage: 'sequelize' makes sequelize-cli record applied seeders in a
// SequelizeData table so `db:seed:all` skips already-run seeders on repeat
// invocations (without it, the default 'none' re-runs every seeder every time
// and breaks idempotency of `npm run setup`).
const sharedOptions = {
  seederStorage: 'sequelize',
};

module.exports = {
  development: {
    ...sharedOptions,
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..', 'database.sqlite'),
    logging: false,
  },
  test: {
    ...sharedOptions,
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    ...sharedOptions,
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..', 'database.sqlite'),
    logging: false,
  },
};
