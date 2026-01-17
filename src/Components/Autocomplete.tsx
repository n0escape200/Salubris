import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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
  const inputRef = useRef<TextInput>(null);
  const isSelectingOptionRef = useRef(false);

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

  // Handle option press
  const handleOptionPress = (opt: Option) => {
    isSelectingOptionRef.current = true;
    handleSelect(opt);
    // Reset after a short delay
    setTimeout(() => {
      isSelectingOptionRef.current = false;
    }, 100);
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Only close if not selecting an option
    setTimeout(() => {
      if (!isSelectingOptionRef.current) {
        setIsOpen(false);
      }
    }, 200);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle text change
  const handleTextChange = (text: string) => {
    setValue(text);
    setIsOpen(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#b0b0b0"
        value={value}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={handleTextChange}
      />

      {isOpen && filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView
            style={{ maxHeight: 220 }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            // These props prevent the scroll from propagating to parent
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={() => {
              // When user starts scrolling the dropdown
              isSelectingOptionRef.current = true;
            }}
            onResponderRelease={() => {
              // When user stops scrolling
              setTimeout(() => {
                isSelectingOptionRef.current = false;
              }, 50);
            }}
            onResponderTerminationRequest={() => false}
          >
            {filteredOptions.map((opt, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleOptionPress(opt)}
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

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  input: {
    borderBottomColor: '#ffffff80',
    borderBottomWidth: 0.5,
    color: 'white',
    paddingVertical: 8,
    zIndex: 1001,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#bdbdbdff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
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
