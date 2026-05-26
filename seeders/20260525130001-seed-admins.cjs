'use strict';

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
