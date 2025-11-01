import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const databaseSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'product',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'calaories', type: 'number' },
        { name: 'protein', type: 'number' },
        { name: 'carbs', type: 'number' },
        { name: 'fats', type: 'number' },
      ],
    }),
  ],
});
