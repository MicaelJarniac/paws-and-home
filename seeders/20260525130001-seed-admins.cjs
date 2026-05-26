'use strict';

// MUST stay .cjs — sequelize-cli v6 loads each seeder via require()
// (CJS only). Because package.json declares "type": "module", a .js
// extension would force ESM parsing and break with "module is not defined
// in ES module scope". See README "Why some files are .cjs" for details.
// Tracking native ESM support: https://github.com/sequelize/cli/issues/1436

// CJS imports — required by the file's CommonJS contract (see header above).
const bcrypt = require('bcryptjs');
const { randomUUID } = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const now = new Date();
    await queryInterface.bulkInsert('Admins', [
      {
        id: randomUUID(),
        username: 'admin',
        email: 'admin@pawsandhome.org',
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Admins', { username: 'admin' });
  },
};
