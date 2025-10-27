import { Pressable, Text, View } from 'react-native';
import { styles } from '../Styles';
import { footerItems } from '../Constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { navigationRef } from '../Utils/NavigationRef';
import { useEffect, useState } from 'react';
import Vocabulary from '../Vocabulary';

export default function Footer() {
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(
    undefined,
  );
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    setShouldUpdate(false);
    if (navigationRef.isReady()) {
      setCurrentRoute(navigationRef.getCurrentRoute()?.name);
    }
  }, [shouldUpdate]);

  return (
    <View style={styles.footer}>
      {footerItems.map(item => {
        return (
          <Pressable
            style={{
              backgroundColor:
                currentRoute === item.label ? '#c9c9c9' : 'transparent',
              padding: 6,
              borderRadius: 5,
              width: 60,
            }}
            key={item.label}
            onPress={() => {
              (navigationRef as any).navigate(item.label);
              setShouldUpdate(true);
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
                  fontSize: 11,
                }}
              >
                {item.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
