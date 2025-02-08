import { DataSource } from 'typeorm';
import { entities } from './importOrm';

export const db = () =>
  new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    dropSchema: false,
    entities: entities(),
    migrations: [],
    migrationsRun: false,
    ssl: process.env.CACERT
      ? {
          rejectUnauthorized: false,
          ca: process.env.CACERT,
        }
      : undefined,
  });
