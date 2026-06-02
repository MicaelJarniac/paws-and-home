import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import sequelize from '../config/database.js';

export class Application extends Model<
  InferAttributes<Application>,
  InferCreationAttributes<Application>
> {
  declare id: CreationOptional<string>;
  declare fullName: string;
  declare email: string;
  declare phone: string;
  declare cpf: string;
  declare petType: string;
  declare petName: string | null;
  declare homeType: string;
  declare experience: string;
  declare notes: string | null;
  declare status: CreationOptional<string>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;
}

Application.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(15), allowNull: false },
    cpf: { type: DataTypes.STRING(14), allowNull: false },
    petType: { type: DataTypes.STRING, allowNull: false },
    petName: { type: DataTypes.STRING(100), allowNull: true },
    homeType: { type: DataTypes.STRING, allowNull: false },
    experience: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { sequelize, modelName: 'Application', paranoid: true },
);

export default Application;
