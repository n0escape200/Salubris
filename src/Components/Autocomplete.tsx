import React, { useState, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';

type Option = string | Record<string, any>;

type AutocompleteProps = {
  placeholder: string;
  options: Option[];
  optionLabel?: string;
  onChange?: (value: any) => void;
  initValue?: string;
};

export default function Autocomplete(props: AutocompleteProps) {
  const { placeholder, options, optionLabel, onChange, initValue } = props;

  const [value, setValue] = useState(initValue ?? '');
  const [isOpen, setIsOpen] = useState(false);

  const getLabel = (opt: Option) => {
    if (typeof opt === 'string') return opt;
    if (optionLabel && opt?.[optionLabel] != null)
      return String(opt[optionLabel]);
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
  };

  return (
    <View style={{ zIndex: 1000 }}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#b0b0b0"
        value={value}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onChangeText={text => {
          setValue(text);
          setIsOpen(true);
        }}
      />

      {isOpen && filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView keyboardShouldPersistTaps="always" nestedScrollEnabled>
            {filteredOptions.map((opt, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleSelect(opt)}
                style={({ pressed }) => [
                  styles.option,
                  pressed && { backgroundColor: '#1e1e1e' },
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

const styles = StyleSheet.create({
  input: {
    borderBottomColor: '#ffffff80',
    borderBottomWidth: 0.5,
    color: 'white',
    paddingVertical: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    maxHeight: 220,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#bdbdbdff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    zIndex: 1000,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#444',
    borderBottomWidth: 0.5,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
