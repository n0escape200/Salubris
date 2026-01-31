import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { json } from '@nozbe/watermelondb/decorators';

const sanitizeReactions = (rawReactions: any[]) => {
  return Array.isArray(rawReactions) ? rawReactions.map(String) : [];
};

export default class Meal extends Model {
  static table = 'meals';
  @field('name') name: string;
  @json('name', sanitizeReactions) products: string[];
}

export interface ProductType {
  id: string | undefined;
  name: string;
  products: string[];
}
