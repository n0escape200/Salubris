import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class TrackLine extends Model {
  static table = 'track_lines';

  // Remove old relation if you no longer need it
  // static associations = {
  //   products: { type: 'belongs_to', key: 'product_id' },
  // } as const;

  @field('date') date!: string;
  @field('quantity') quantity!: number;
  @field('unit') unit!: string;

  // New denormalized product fields
  @field('name') name!: string;
  @field('calories') calories!: number;
  @field('protein') protein!: number;
  @field('carbs') carbs!: number;
  @field('fats') fats!: number;
}

export interface TrackLineType {
  id?: string;
  date: string;
  quantity: number;
  name: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}
