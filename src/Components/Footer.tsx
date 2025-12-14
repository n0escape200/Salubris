import { BackHandler, Pressable, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import { footerItems } from '../Utils/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { navigationRef } from '../Utils/NavigationRef';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(
    undefined,
  );

  const updateCurrentRoute = () => {
    if (navigationRef.isReady()) {
      setCurrentRoute(navigationRef.getCurrentRoute()?.name);
    }
  };

  useEffect(() => {
    // Update initially
    updateCurrentRoute();

    // Listen for hardware back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Delay to allow navigation to update
        setTimeout(updateCurrentRoute, 50);
        return false; // Let the default back action happen
      },
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.footer}>
      {footerItems.map(item => (
        <Pressable
          style={{
            backgroundColor:
              currentRoute === item.label ? '#c9c9c9' : 'transparent',
            padding: 6,
            borderRadius: 5,
            width: 62,
          }}
          key={item.label}
          onPress={() => {
            (navigationRef as any).navigate(item.label);
            setTimeout(updateCurrentRoute, 50); // Small delay to ensure navigationRef updates
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon
              color={currentRoute === item.label ? '#1c1c1c' : 'white'}
              icon={item.icon}
              size={20}
            />
            <Text
              style={{
                color: currentRoute === item.label ? '#1c1c1c' : 'white',
                fontSize: 10,
              }}
            >
              {item.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
