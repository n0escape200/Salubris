import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';
import Product from './Product';

export default class TrackLine extends Model {
  static table = 'track_lines';

  static associations = {
    products: { type: 'has_many', foreignKey: 'track_line_id' },
  } as const;

  @field('date') date: string;
  @children('products') product: Product;
}
