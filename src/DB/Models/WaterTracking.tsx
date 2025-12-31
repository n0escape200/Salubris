import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class WaterTracking extends Model {
  static table = 'water_tracking';

  @field('ammount') ammount: string;
  @field('date') date: string;
}

export interface WaterTrackingType {
  id?: string;
  ammount: string;
  date: string;
}
