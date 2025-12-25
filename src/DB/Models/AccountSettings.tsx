import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class AccountSettings extends Model {
  static table = 'account_settings';

  @field('field') field: string;
  @field('value') value: string;
}

export interface AccountSettingsType {
  id?: string;
  field: string;
  value: string;
}
