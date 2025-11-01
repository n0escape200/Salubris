import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class Product extends Model {
  static table = 'posts';

  @field('name') name: string;
  @field('calories') calories: number;
  @field('protein') protein: number;
  @field('carbs') carbs: number;
  @field('fats') fats: number;
}
