import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { databaseSchema } from './Schemas';
import Product from './Models/Product';
import TrackLine from './Models/TrackLine';
import { migrations } from './Migrations';

const adapter = new SQLiteAdapter({
  schema: databaseSchema,
  migrations,
});

export const database = new Database({
  adapter,
  modelClasses: [Product, TrackLine],
});
