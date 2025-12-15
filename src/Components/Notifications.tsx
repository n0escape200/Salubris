import { Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useNotification } from '../Utils/Contexts/NotificationContext';

export const Notifications = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      {notifications.map((notification, index) => {
        const backgroundColor =
          notification.type === 'ERROR' ? '#ff4d4f' : '#4caf50';
        return (
          <Animated.View
            key={notification.id}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 50 + index * 60, // stacked spacing
              marginHorizontal: 20,
              backgroundColor,
              borderRadius: 10,
              height: 50,
              zIndex: 3,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', flex: 1 }}>
              {notification.message}
            </Text>
            <Pressable
              onPress={() => removeNotification(notification.id)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                marginLeft: 10,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>×</Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </>
  );
};
