import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useState } from 'react';

type TabSelectType = {
  options: string[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const MENU_WIDTH = 180;
const MENU_ITEM_HEIGHT = 32;

export default function TabSelect({ options, page, setPage }: TabSelectType) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);

  const toggleMenu = () => {
    setOpen(prev => !prev);
    progress.value = withTiming(open ? 0 : 1, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
  };

  const animatedMenuStyle = useAnimatedStyle(() => {
    const scale = progress.value;

    return {
      opacity: scale,
      transform: [
        { translateX: MENU_WIDTH * (1 - scale) * -0.5 },
        { translateY: options.length * MENU_ITEM_HEIGHT * (1 - scale) * -0.5 },
        { scale },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
          marginLeft: 10,
        }}
      >
        <Pressable onPress={toggleMenu}>
          <View style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faBars} />
          </View>
        </Pressable>
        <Text style={{ color: 'white', fontSize: 27, fontWeight: 600 }}>
          {`${options[page - 1]}`}
        </Text>
      </View>

      <Animated.View style={[styles.menu, animatedMenuStyle]}>
        {options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setPage(index + 1);
              toggleMenu();
            }}
          >
            <Text style={styles.menuItem}>{option}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    position: 'relative',
  },
  iconWrapper: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    borderBottomRightRadius: 0,
  },
  menu: {
    position: 'absolute',
    top: 37,
    left: 47,
    width: MENU_WIDTH,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    zIndex: 10,
  },
  menuItem: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    height: MENU_ITEM_HEIGHT,
  },
});
