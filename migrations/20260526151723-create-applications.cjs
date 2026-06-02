'use strict';

// MUST stay .cjs — sequelize-cli v6 loads each migration via require()
// (CJS only). Because package.json declares "type": "module", a .js
// extension would force ESM parsing and break with "module is not defined
// in ES module scope". See README "Why some files are .cjs" for details.
// Tracking native ESM support: https://github.com/sequelize/cli/issues/1436

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fullName: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING(15), allowNull: false },
      cpf: { type: Sequelize.STRING(14), allowNull: false },
      petType: { type: Sequelize.STRING, allowNull: false },
      petName: { type: Sequelize.STRING(100), allowNull: true },
      homeType: { type: Sequelize.STRING, allowNull: false },
      experience: { type: Sequelize.STRING, allowNull: false },
      notes: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Applications');
  },
};
