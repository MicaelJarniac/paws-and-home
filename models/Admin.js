import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

Admin.beforeCreate(async (admin) => {
  admin.password = await bcrypt.hash(admin.password, 10);
});

Admin.beforeUpdate(async (admin) => {
  if (admin.changed('password')) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

Admin.prototype.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default Admin;
