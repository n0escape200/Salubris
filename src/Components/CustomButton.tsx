import { Pressable, Text, View } from 'react-native';

type CustomButtonProps = {
  label: string;
  color?: string;
  fontColor?: string;
  innerShadow?: string;
  width?: number;
  onPress?: () => void;
};

export default function CustomButton(props: CustomButtonProps) {
  const { label, color, fontColor, innerShadow, width, onPress } = props;
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: color ? color : 'white',
          marginTop: 10,
          width: width ? width : '100%',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
        pressed && { opacity: 0.9 },
      ]}
      onPress={() => {
        onPress?.();
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          right: 4,
          bottom: 4,
          borderRadius: 16,
          backgroundColor: innerShadow ? innerShadow : '',
        }}
      />
      <Text
        style={{
          color: fontColor ? fontColor : 'black',
          fontWeight: 'bold',
          zIndex: 1,
          fontSize: 20,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
