import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

async function up() {
  const qi = sequelize.getQueryInterface();

  await qi.createTable('Pets', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    species: { type: DataTypes.STRING, allowNull: false },
    breed: { type: DataTypes.STRING, allowNull: false },
    birthday: { type: DataTypes.DATEONLY, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    alt: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'available' },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  });

  await qi.createTable('Admins', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true },
  });

  console.log('Migration complete — tables created.');
}

async function down() {
  const qi = sequelize.getQueryInterface();
  await qi.dropTable('Pets');
  await qi.dropTable('Admins');
  console.log('Rollback complete — tables dropped.');
}

const command = process.argv[2];

if (command === 'down') {
  down()
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); });
} else {
  up()
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); });
}
