import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import { createTable } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        {
          type: 'add_columns',
          table: 'track_lines',
          columns: [
            { name: 'calories', type: 'number' },
            { name: 'protein', type: 'number' },
            { name: 'carbs', type: 'number' },
            { name: 'fats', type: 'number' },
          ],
        },
      ],
    },
    {
      toVersion: 3,
      steps: [
        {
          type: 'add_columns',
          table: 'track_lines',
          columns: [{ name: 'name', type: 'string' }],
        },
      ],
    },
    {
      toVersion: 4,
      steps: [
        createTable({
          name: 'water_tracking',
          columns: [
            { name: 'ammount', type: 'string' },
            { name: 'date', type: 'string' },
          ],
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        createTable({
          name: 'account_settings',
          columns: [
            { name: 'field', type: 'string' },
            { name: 'value', type: 'string' },
          ],
        }),
      ],
    },
  ],
});
