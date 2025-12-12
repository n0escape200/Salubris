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
  kcal: number | null;
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
      kcal: negative.energy ?? null,
      fat: negative.fat ?? negative['saturated_fat'] ?? null,
      carbs: negative.sugars ?? null,
      proteins: positive.proteins ?? null,
    };
  } else {
    // 2021-style: values directly in data
    return {
      kcal: data.energy ?? null,
      fat: data.saturated_fat ?? null,
      carbs: data.sugars ?? null,
      proteins: data.proteins ?? null,
    };
  }
}
