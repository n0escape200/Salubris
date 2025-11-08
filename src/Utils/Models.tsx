import { notificationTypes } from './Constants';

// ======  CLASSES =====

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
