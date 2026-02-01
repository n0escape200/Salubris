import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  StyleProp,
  TextInput,
  TextInputSubmitEditingEvent,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  validate?: boolean;
  onChange?: (value: string) => void;
  backgroundColor?: string;
  type?: 'number' | undefined;
  onSubmit?: (e: TextInputSubmitEditingEvent) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  clearOnSubmit?: boolean;
  required?: boolean;
  error?: string;
  secureTextEntry?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | 'default';
  blurOnSubmit?: boolean; // Add this prop for control
  autoFocus?: boolean;
};

export default forwardRef(function Input(
  {
    label,
    placeholder,
    value: propValue = '',
    validate = false,
    onChange,
    onSubmit,
    onBlur,
    onFocus,
    backgroundColor = '#1c1c1c',
    type,
    style,
    inputStyle,
    clearOnSubmit = false,
    required = false,
    error,
    secureTextEntry = false,
    returnKeyType = 'default',
    blurOnSubmit = true, // Change default to true for better UX
    autoFocus = false,
  }: InputProps,
  ref,
) {
  const [value, setValue] = useState(propValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const top = useSharedValue(label ? 12 : 0);
  const left = useSharedValue(12);
  const paddingHorizontal = useSharedValue(0);
  const opacity = useSharedValue(label ? 1 : 0);
  const borderWidth = useSharedValue(0.5);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  useEffect(() => {
    if (label) {
      const isActive = isFocused || value.length > 0;
      top.value = withTiming(isActive ? -10 : 8, { duration: 200 });
      left.value = withTiming(12, { duration: 200 });
      paddingHorizontal.value = withTiming(isActive ? 6 : 0, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }

    // Animate border on focus
    borderWidth.value = withTiming(isFocused ? 1.5 : 0.5, { duration: 200 });
  }, [isFocused, value, label]);

  const labelStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: top.value,
    left: left.value,
    fontSize: 14,
    color: error ? '#f44336' : isFocused ? '#2196F3' : '#aaa',
    backgroundColor:
      isFocused || value.length > 0 ? backgroundColor : 'transparent',
    paddingHorizontal: paddingHorizontal.value,
    borderRadius: 4,
    opacity: opacity.value,
    zIndex: 1,
    fontWeight: '500',
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
    borderColor: error ? '#f44336' : isFocused ? '#2196F3' : '#555',
  }));

  // ✅ Expose imperative functions to parent
  useImperativeHandle(ref, () => ({
    setValidity: (valid: boolean) => {},
    getValue: () => value,
    clear: () => {
      setValue('');
      onChange?.('');
    },
    focus: () => {
      setIsFocused(true);
      inputRef.current?.focus();
    },
    blur: () => {
      setIsFocused(false);
      inputRef.current?.blur();
      onBlur?.();
    },
    setError: (errorMsg: string) => {},
  }));

  const handleSubmitEditing = (e: TextInputSubmitEditingEvent) => {
    if (onSubmit) {
      onSubmit(e);
    }

    // Only clear if explicitly told to
    if (clearOnSubmit) {
      setValue('');
      onChange?.('');
    }

    // Manually blur if blurOnSubmit is true
    if (blurOnSubmit) {
      setIsFocused(false);
      onBlur?.();
    }
  };

  const handleChangeText = (text: string) => {
    setValue(text);
    onChange?.(text);
    if (!isTouched) setIsTouched(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsTouched(true);
    onBlur?.();
  };

  const showError = error && isTouched;

  return (
    <View style={[{ position: 'relative', marginTop: label ? 5 : 0 }, style]}>
      <Animated.View
        style={[
          {
            backgroundColor,
            borderRadius: 8,
          },
          inputAnimatedStyle,
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[
            {
              color: 'white',
              padding: 16,
              paddingTop: label ? 20 : 16,
              fontSize: 16,
              minHeight: 54,
            },
            inputStyle,
          ]}
          keyboardType={type === 'number' ? 'numeric' : 'default'}
          value={value}
          placeholder={label ? '' : placeholder}
          placeholderTextColor="#666"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          blurOnSubmit={blurOnSubmit} // Use the prop value
          returnKeyType={onSubmit ? 'done' : returnKeyType}
          secureTextEntry={secureTextEntry}
          selectionColor="#2196F3"
          autoFocus={autoFocus}
        />
        {label && (
          <Animated.Text style={labelStyle}>
            {label}
            {required && !value && isTouched && (
              <Animated.Text style={{ color: '#f44336' }}> *</Animated.Text>
            )}
          </Animated.Text>
        )}
      </Animated.View>

      {showError && (
        <Animated.Text
          style={{
            color: '#f44336',
            fontSize: 12,
            marginTop: 4,
            marginLeft: 4,
          }}
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
});
