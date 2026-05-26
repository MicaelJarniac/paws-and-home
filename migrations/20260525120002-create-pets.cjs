'use strict';

// MUST stay .cjs — sequelize-cli v6 loads each migration via require()
// (CJS only). Because package.json declares "type": "module", a .js
// extension would force ESM parsing and break with "module is not defined
// in ES module scope". See README "Why some files are .cjs" for details.
// Tracking native ESM support: https://github.com/sequelize/cli/issues/1436

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false },
      species: { type: Sequelize.STRING, allowNull: false },
      breed: { type: Sequelize.STRING, allowNull: false },
      birthday: { type: Sequelize.DATEONLY, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      image: { type: Sequelize.STRING, allowNull: true },
      alt: { type: Sequelize.STRING, allowNull: true },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'available',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Pets');
  },
};
