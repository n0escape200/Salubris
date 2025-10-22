import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type InputProps = {
  label: string;
  onChange?: (value: any) => void;
};

export default function Input({ label, onChange }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [value, setValue] = useState('');
  const top = useSharedValue(10);
  const left = useSharedValue(10);
  const padding = useSharedValue(0);

  useEffect(() => {
    // animate when focus changes
    top.value = withTiming(isFocused || value.length > 0 ? -17 : 10, {
      duration: 200,
    });
    left.value = withTiming(isFocused || value.length > 0 ? 10 : 10, {
      duration: 200,
    });
    padding.value = withTiming(isFocused || value.length > 0 ? 5 : 0, {
      duration: 200,
    });
  }, [isFocused]);

  const labelStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    color: 'white',
    top: top.value,
    left: left.value,
    backgroundColor: 'black',
    padding: padding.value,
    fontSize: 17,
    borderRadius: 10,
  }));

  return (
    <View style={{ position: 'relative', marginTop: 20 }}>
      <TextInput
        style={{
          color: 'white',
          borderColor: 'white',
          borderWidth: 0.8,
          borderRadius: 10,
          padding: 10,
          paddingTop: 16,
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
