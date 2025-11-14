import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { TextInput, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type InputProps = {
  label: string;
  value?: string;
  validate?: boolean;
  onChange?: (value: string) => void;
  backgroundColor?: string;
  type?: 'number' | undefined;
};

export default forwardRef(function Input(
  {
    label,
    value: propValue = '',
    validate = false,
    onChange,
    backgroundColor = '#1e1e1e',
    type,
  }: InputProps,
  ref,
) {
  const [value, setValue] = useState(propValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const top = useSharedValue(12);
  const left = useSharedValue(12);
  const paddingHorizontal = useSharedValue(0);

  useEffect(() => setValue(propValue), [propValue]);

  useEffect(() => {
    const isActive = isFocused || value.length > 0;
    top.value = withTiming(isActive ? -10 : 12, { duration: 200 });
    left.value = withTiming(12, { duration: 200 });
    paddingHorizontal.value = withTiming(isActive ? 6 : 0, { duration: 200 });
  }, [isFocused, value]);

  const labelStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: top.value,
    left: left.value,
    fontSize: 17,
    color: isValid ? 'white' : 'red',
    backgroundColor:
      isFocused || value.length > 0 ? backgroundColor : 'transparent',
    paddingHorizontal: paddingHorizontal.value,
    borderRadius: 4,
  }));

  // ✅ Expose imperative functions to parent
  useImperativeHandle(ref, () => ({
    setValidity: (valid: boolean) => setIsValid(valid),
    getValue: () => value,
  }));

  return (
    <View style={{ position: 'relative', marginTop: 5 }}>
      <TextInput
        style={{
          color: 'white',
          borderColor: isValid ? 'white' : 'red',
          borderWidth: 0.5,
          borderRadius: 5,
          padding: 10,
          paddingTop: 18,
          backgroundColor,
        }}
        keyboardType={type === 'number' ? 'numeric' : 'default'}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={text => {
          setValue(text);
          onChange?.(text);
          setIsValid(true);
        }}
      />
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
    </View>
  );
});
