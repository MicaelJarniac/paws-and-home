'use strict';

// MUST stay .cjs — sequelize-cli v6 loads each migration via require()
// (CJS only). Because package.json declares "type": "module", a .js
// extension would force ESM parsing and break with "module is not defined
// in ES module scope". See README "Why some files are .cjs" for details.
// Tracking native ESM support: https://github.com/sequelize/cli/issues/1436

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admins', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Admins');
  },
};
