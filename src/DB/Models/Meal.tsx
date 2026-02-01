import { Model } from '@nozbe/watermelondb';
import { field, json } from '@nozbe/watermelondb/decorators';

// Define the MealProduct type for type safety
export type MealProduct = {
  id: string;
  quantity: number;
  unit?: string;
};

// JSON sanitizer function
const sanitizeProducts = (rawProducts: any): MealProduct[] => {
  if (!rawProducts) return [];

  try {
    if (typeof rawProducts === 'string') {
      const parsed = JSON.parse(rawProducts);
      return Array.isArray(parsed) ? parsed : [];
    }
    return Array.isArray(rawProducts) ? rawProducts : [];
  } catch (error) {
    console.error('Error parsing products:', error);
    return [];
  }
};

export default class Meal extends Model {
  static table = 'meals';

  @field('name')
  name: string;

  @json('products', sanitizeProducts)
  products: MealProduct[];
}
