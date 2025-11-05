import { notificationTypes } from './Constants';

// ======  CLASSES ======
export default class ProductClass {
  name: string = '';
  calories: number = 0;
  protein: number = 0;
  carbs: number = 0;
  fats: number = 0;
}

// ======  END CLASSES ======

// ======  TYPES ======
export type NotificationType = {
  type: 'ERROR' | 'SUCCESS';
  message: string;
};

// Internal type for tracking notifications
export type NotificationWithId = NotificationType & { id: string };

export type NotificationContextType = {
  notifications: NotificationWithId[];
  addNotification: (notification: NotificationType) => void;
  removeNotification: (id: string) => void;
};
// ======  END TYPES ======
