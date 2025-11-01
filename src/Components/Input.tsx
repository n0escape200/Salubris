import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type InputProps = {
  label: string;
  onChange?: (value: string) => void;
  backgroundColor?: string;
};

export default function Input({
  label,
  onChange,
  backgroundColor = '#1e1e1e',
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');

  const top = useSharedValue(12); // initial position
  const left = useSharedValue(12);
  const paddingHorizontal = useSharedValue(0);

  useEffect(() => {
    const isActive = isFocused || value.length > 0;

    top.value = withTiming(isActive ? -10 : 12, { duration: 200 });
    left.value = withTiming(12, { duration: 200 }); // fixed left
    paddingHorizontal.value = withTiming(isActive ? 6 : 0, { duration: 200 });
  }, [isFocused, value]);

  const labelStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: top.value,
    left: left.value,
    fontSize: 17,
    color: 'white',
    backgroundColor:
      isFocused || value.length > 0 ? backgroundColor : 'transparent',
    paddingHorizontal: paddingHorizontal.value,
    borderRadius: 4,
  }));

  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        style={{
          color: 'white',
          borderColor: 'white',
          borderWidth: 0.5,
          borderRadius: 5,
          padding: 10,
          paddingTop: 18,
          backgroundColor, // dynamic background
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={text => {
          setValue(text);
          onChange?.(text);
        }}
      />
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
    </View>
  );
}
