import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { styles } from '../Utils/Styles';

type AutocompleteProps = {
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  options: Array<string>;
};

const Autocomplete = forwardRef<View, AutocompleteProps>((props, ref) => {
  const { isFocused, setIsFocused, options } = props;
  const containerRef = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => containerRef.current!);

  useEffect(() => {
    if (!isFocused && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isFocused]);

  return (
    <View
      style={{ position: 'relative', zIndex: 1 }}
      ref={containerRef}
      collapsable={false}
    >
      <TextInput
        ref={inputRef}
        style={{
          borderBottomColor: 'white',
          borderBottomWidth: 0.5,
          color: 'white',
        }}
        placeholder="Product"
        placeholderTextColor="#525252ff"
        onFocus={() => setIsFocused(true)}
        value={value}
        onChangeText={setValue}
      />

      {isFocused && (
        <View
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            backgroundColor: '#272727ff',
          }}
        >
          <ScrollView>
            {options.map(option => {
              return (
                <Pressable
                  onPress={() => {
                    setValue(option);
                    setIsFocused(false);
                  }}
                  key={option}
                >
                  <Text
                    style={[
                      styles.textl,
                      { borderColor: '#636363ff', borderWidth: 1, padding: 5 },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
});

export default Autocomplete;
