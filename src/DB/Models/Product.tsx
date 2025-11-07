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

  @relation('track_lines', 'track_line_id') trackLine: TrackLine;
}
