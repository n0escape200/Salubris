import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  NotificationType,
  NotificationWithId,
  NotificationContextType,
} from '../Models';

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider = (props: NotificationProviderProps) => {
  const { children } = props;
  const [notifications, setNotifications] = useState<NotificationWithId[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const addNotification = (notification: NotificationType) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    const timer = setTimeout(() => removeNotification(id), 4000);
    timersRef.current[id] = timer;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
