import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from 'react';
import { styles } from '../Utils/Styles';

type Option = string | Record<string, any>;

type AutocompleteProps = {
  placeholder: string;
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  options: Option[];
  optionLabel?: string;
  onChange?: (value: any) => void;
  initValue?: any;
};

const Autocomplete = forwardRef<View, AutocompleteProps>((props, ref) => {
  const {
    isFocused,
    setIsFocused,
    options,
    optionLabel,
    onChange,
    placeholder,
    initValue,
  } = props;
  const containerRef = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => containerRef.current!);
  useEffect(() => {
    if (initValue) {
      setValue(initValue);
    }
    return () => {
      setIsFocused(false);
    };
  }, []);

  useEffect(() => {
    if (!isFocused && inputRef.current) inputRef.current.blur();
  }, [isFocused]);

  const getLabel = (opt: Option): string => {
    if (typeof opt === 'string') return opt;
    if (optionLabel && typeof opt === 'object' && opt[optionLabel] != null)
      return String(opt[optionLabel]);
    return '';
  };

  const filteredOptions = useMemo(() => {
    if (!value.trim()) return options;
    const lower = value.toLowerCase();
    return options.filter(opt => getLabel(opt).toLowerCase().includes(lower));
  }, [value, options]);

  const handleSelect = (opt: Option) => {
    if (onChange) {
      onChange(opt);
    }
    setValue(getLabel(opt));
    setIsFocused(false);
  };

  return (
    <View ref={containerRef}>
      <TextInput
        ref={inputRef}
        style={{
          borderBottomColor: 'white',
          borderBottomWidth: 0.5,
          color: 'white',
        }}
        placeholder={placeholder}
        placeholderTextColor="#525252ff"
        onFocus={() => {
          setIsFocused(true);
        }}
        value={value}
        onChangeText={setValue}
      />

      {isFocused && filteredOptions.length > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            maxHeight: 200,
            backgroundColor: '#272727ff',
            borderWidth: 1,
            borderColor: '#636363ff',
            zIndex: 9999,
          }}
        >
          <ScrollView
            style={{ maxHeight: 200 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {filteredOptions.map((opt, index) => (
              <Pressable key={index} onPress={() => handleSelect(opt)}>
                <Text
                  style={[
                    styles.textl,
                    { borderColor: '#636363ff', borderWidth: 1, padding: 5 },
                  ]}
                >
                  {getLabel(opt)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
});

export default Autocomplete;
