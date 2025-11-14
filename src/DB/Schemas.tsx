import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const databaseSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'products',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'calories', type: 'number' },
        { name: 'protein', type: 'number' },
        { name: 'carbs', type: 'number' },
        { name: 'fats', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'track_lines',
      columns: [
        { name: 'date', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'product_id', type: 'string' },
      ],
    }),
  ],
});
