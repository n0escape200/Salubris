import React, { useState, useMemo, useRef } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from '../Utils/Styles';

type Option = string | Record<string, any>;

type AutocompleteProps = {
  placeholder: string;
  options: Option[];
  optionLabel?: string;
  onChange?: (value: any) => void;
  initValue?: string;
  textInputStyle?: any;
  style?: StyleProp<ViewStyle>;
};

export default function Autocomplete({
  placeholder,
  options,
  optionLabel,
  onChange,
  initValue,
  textInputStyle,
  style,
}: AutocompleteProps) {
  const [value, setValue] = useState(initValue ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const getLabel = (opt: Option) => {
    if (typeof opt === 'string') return opt;
    if (optionLabel && opt?.[optionLabel] != null) {
      return String(opt[optionLabel]);
    }
    return '';
  };

  const filteredOptions = useMemo(() => {
    if (!value.trim()) return options;
    const lower = value.toLowerCase();
    return options.filter(opt => getLabel(opt).toLowerCase().includes(lower));
  }, [value, options]);

  const handleSelect = (opt: Option) => {
    const label = getLabel(opt);
    setValue(label);
    setIsOpen(false);
    onChange?.(opt);
    requestAnimationFrame(() => {
      inputRef.current?.blur();
    });
  };

  return (
    <View style={style}>
      <TextInput
        ref={inputRef}
        style={[styles.input, textInputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#b0b0b0"
        value={value}
        onFocus={() => setIsOpen(true)}
        onChangeText={text => {
          setValue(text);
          setIsOpen(true);
        }}
        onBlur={() => {
          setIsOpen(false);
        }}
      />

      {isOpen && filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView
            style={{ maxHeight: 220 }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator
          >
            {filteredOptions.map((opt, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleSelect(opt)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && { backgroundColor: '#2a2a2a' },
                ]}
              >
                <Text style={styles.optionText}>{getLabel(opt)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
