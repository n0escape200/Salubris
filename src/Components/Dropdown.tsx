import { faCircleXmark, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type DropdownProps = {
  options?: string[];
  maxVisibleItems?: number;
  itemHeight?: number;
};

export default function Dropdown({
  options = [],
  maxVisibleItems = 4,
  itemHeight = 40,
}: DropdownProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState<any>();

  const visibleItemCount = Math.min(options.length, maxVisibleItems);
  const dropdownHeight = visibleItemCount * itemHeight;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-10);
  const height = useSharedValue(0);

  useEffect(() => {
    if (isFocused && options.length > 0) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
      height.value = withTiming(dropdownHeight, { duration: 250 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-10, { duration: 200 });
      height.value = withTiming(0, { duration: 250 });
    }
  }, [isFocused, options.length]);

  const dropdownStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    height: height.value,
  }));

  return (
    <View style={{ marginTop: 10, position: 'relative' }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setIsFocused(!isFocused);
          }}
        >
          <View style={{ width: '90%' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomColor: 'white',
                borderBottomWidth: 0.5,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  padding: 5,
                }}
              >
                {selected ? selected : 'Sorting'}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <View style={{ transform: [{ scaleY: isFocused ? 1 : -1 }] }}>
                  <FontAwesomeIcon
                    style={{ marginBottom: 10 }}
                    color="#ffffffff"
                    icon={faSortDown}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            setSelected('');
            setIsFocused(false);
          }}
        >
          <View>
            <FontAwesomeIcon color="#ffffffff" icon={faCircleXmark} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Only render dropdown when focused */}
      {isFocused && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 40,
              left: 0,
              width: '100%',
              zIndex: 1,
              borderColor: '#333333ff',
              borderWidth: 1,
              backgroundColor: '#161616ff',
              overflow: 'hidden',
              borderRadius: 5,
            },
            dropdownStyle,
          ]}
        >
          <ScrollView>
            {options.length === 0 ? (
              <Text style={{ color: '#707070ff', padding: 10 }}>
                No options
              </Text>
            ) : (
              options.map((option, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    setSelected(option);
                    setIsFocused(false);
                  }}
                >
                  <Text
                    style={{
                      color: '#d0d0d0',
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      height: itemHeight,
                    }}
                  >
                    {option}
                  </Text>
                  {index < options.length - 1 && (
                    <View style={{ backgroundColor: '#333', height: 1 }} />
                  )}
                </Pressable>
              ))
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}
