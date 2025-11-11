import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import TrackLine from './TrackLine';

export default class Product extends Model {
  static table = 'products';

  static associations = {
    track_lines: { type: 'belongs_to', key: 'track_line_id' },
  } as const;

  @field('name') name: string;
  @field('calories') calories: number;
  @field('protein') protein: number;
  @field('carbs') carbs: number;
  @field('fats') fats: number;
  @field('track_line_id') trackLineId?: string;
  @relation('track_lines', 'track_line_id') trackLine: TrackLine;
}

export interface ProductType {
  id: string | undefined;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  trackLineId?: string;
}
