import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Product extends Model {
  static table = 'products';

  static associations = {
    track_lines: { type: 'has_many', foreignKey: 'product_id' },
  } as const;

  @field('name') name: string;
  @field('calories') calories: number;
  @field('protein') protein: number;
  @field('carbs') carbs: number;
  @field('fats') fats: number;
}

export interface ProductType {
  id: string | undefined;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}
