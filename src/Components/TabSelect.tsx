import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { JSX, useState } from 'react';

export type TabLabel = {
  icon?: JSX.Element;
  label: string;
};

type TabSelectType = {
  options: TabLabel[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function TabSelect({ options, page, setPage }: TabSelectType) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const menuWidth = useSharedValue(0);
  const menuHeight = useSharedValue(0);

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
        { translateX: -menuWidth.value * 0.5 * (1 - scale) },
        { translateY: -menuHeight.value * 0.5 * (1 - scale) },
        { scale },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={toggleMenu}>
          <View style={styles.iconWrapper}>
            <FontAwesomeIcon icon={faBars} />
          </View>
        </Pressable>
        <Text style={styles.title}>{options[page - 1]?.label}</Text>
      </View>

      {open && (
        <Animated.View
          style={[styles.menu, animatedMenuStyle]}
          onLayout={e => {
            const { width, height } = e.nativeEvent.layout;
            menuWidth.value = width;
            menuHeight.value = height;
          }}
        >
          {options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => {
                setPage(index + 1);
                toggleMenu();
              }}
            >
              <View style={styles.menuRow}>
                {option.icon}
                <Text style={styles.menuItem}>{option.label}</Text>
              </View>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

// ... styles remain the same

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    position: 'relative',
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 10,
  },
  iconWrapper: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    borderBottomRightRadius: 0,
  },
  title: {
    color: 'white',
    fontSize: 27,
    fontWeight: '600',
  },
  menu: {
    position: 'absolute',
    top: 37,
    left: 47,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    zIndex: 10,
    gap: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(230, 230, 230, 1)',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  menuItem: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
});
