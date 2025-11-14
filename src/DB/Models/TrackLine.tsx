import { Model } from '@nozbe/watermelondb';
import { field, children, relation } from '@nozbe/watermelondb/decorators';
import Product from './Product';

export default class TrackLine extends Model {
  static table = 'track_lines';

  static associations = {
    products: { type: 'belongs_to', key: 'product_id' },
  } as const;

  @field('date') date: string;
  @field('quantity') quantity: number;
  @field('unit') unit: string;
  @relation('product', 'product_id') product: Product;
}

export interface TrackLineType {
  id: string | undefined;
  date: string;
  quantity: number;
  unit: string;
  product: string;
}
