import { Q } from '@nozbe/watermelondb';
import { database } from '../DB/Database';
import AccountSettings from '../DB/Models/AccountSettings';

export function mapState(
  data: Record<string, any>,
  state: Record<string, any>,
  setState: React.Dispatch<React.SetStateAction<any>>,
) {
  const source = data._raw ? data._raw : data;

  const newState = { ...state };

  Object.entries(source).forEach(([key, value]) => {
    if (key in newState) {
      newState[key] = value;
    }
  });
  setState(newState);
}

type Macros = {
  name: string;
  kj: number | null;
  proteins: number | null;
  carbs: number | null;
  fat: number | null;
};

export function getLatestMacros(product: any): Macros | null {
  const nutriscore = product?.nutriscore;
  console.log('nutriscore', nutriscore);
  if (!nutriscore || typeof nutriscore !== 'object') return null;

  // Get the last entry by key order
  const years = Object.keys(nutriscore);
  if (years.length === 0) return null;
  const lastYear = years[years.length - 1];
  const entry = nutriscore[lastYear];

  if (!entry?.data) return null;
  const data = entry.data;

  // 2023-style: components.negative and components.positive
  if (data.components) {
    const negative = (data.components.negative ?? []).reduce(
      (acc: any, item: any) => {
        acc[item.id] = item.value;
        return acc;
      },
      {},
    );
    const positive = (data.components.positive ?? []).reduce(
      (acc: any, item: any) => {
        acc[item.id] = item.value;
        return acc;
      },
      {},
    );

    return {
      name: product.product_name,
      kj: negative.energy ?? null,
      fat: negative.fat ?? negative['saturated_fat'] ?? null,
      carbs: negative.sugars ?? null,
      proteins: positive.proteins ?? null,
    };
  } else {
    // 2021-style: values directly in data
    return {
      name: product.product_name,
      kj: data.energy ?? null,
      fat: data.saturated_fat ?? null,
      carbs: data.sugars ?? null,
      proteins: data.proteins ?? null,
    };
  }
}

export async function checkSetting(
  tableName: string,
  field: string,
  value: string,
) {
  if (!field) {
    return;
  }

  await database.write(async () => {
    const settingsCollection = database.collections.get<any>(tableName);

    const existing = await settingsCollection
      .query(Q.where('field', field))
      .fetch();

    if (existing.length === 0) {
      await settingsCollection.create(setting => {
        setting.field = field;
        setting.value = value;
      });
    }
  });
}
