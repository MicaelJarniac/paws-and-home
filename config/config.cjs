// MUST stay .cjs — sequelize-cli v6 loads this via require() (CJS only).
// package.json declares "type": "module", so a .js extension would force
// ESM parsing and break with "module is not defined in ES module scope".
// src/config/database.ts also reads this file via createRequire() so the
// runtime and the CLI share a single source of truth. See README
// "Why some files are .cjs" for details.
// Tracking native ESM support: https://github.com/sequelize/cli/issues/1436

const path = require('path');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..', 'database.sqlite'),
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..', 'database.sqlite'),
    logging: false,
  },
};
