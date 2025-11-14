import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class TrackLine extends Model {
  static table = 'track_lines';

  static associations = {
    products: { type: 'belongs_to', key: 'product_id' },
  } as const;

  @field('date') date: string;
  @field('quantity') quantity: number;
  @field('unit') unit: string;
  @relation('products', 'product_id') product_id: any;
}

export interface TrackLineType {
  id: string | undefined;
  date: string;
  quantity: number;
  unit: string;
  product_id: string;
}
