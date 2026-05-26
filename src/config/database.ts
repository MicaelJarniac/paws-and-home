import { Sequelize, type Options } from 'sequelize';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const allConfig = require('../../config/config.cjs') as Record<string, Options>;

const env = (process.env.NODE_ENV ?? 'development') as keyof typeof allConfig;
const config = allConfig[env];
if (!config) {
  throw new Error(`No sequelize config for NODE_ENV="${env}"`);
}

export const sequelize = new Sequelize(config);
export default sequelize;
