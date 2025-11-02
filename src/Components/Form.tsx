import { ReactNode } from 'react';
import { View } from 'react-native';
import CustomButton from './CustomButton';

type FormProps = {
  children: ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
};
export default function Form(props: FormProps) {
  const { children, onSubmit, onCancel } = props;
  return (
    <View style={{ gap: 15 }}>
      {children}
      <CustomButton
        color="#1e1e1e"
        fontColor="#ffffffff"
        innerShadow="#2b2b2bff"
        label="Submit"
        onPress={onSubmit}
      />
      <CustomButton
        color="#2b2b2bff"
        fontColor="#dd4c6bff"
        innerShadow="#1e1e1e"
        label="Cancel"
        onPress={onCancel}
      />
    </View>
  );
}
