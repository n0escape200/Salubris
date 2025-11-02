import { ReactNode, RefObject } from 'react';
import {
  GestureResponderEvent,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

type CustomModalProps = {
  title: string;
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  childRef?: RefObject<any>;
  onPressOutside?: () => void;
};

export default function CustomModal(props: CustomModalProps) {
  const { open, onClose, children, childRef, onPressOutside } = props;

  const handleTapOutside = (evt: GestureResponderEvent) => {
    if (!childRef?.current) return;

    childRef.current.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        const { pageX, pageY } = evt.nativeEvent;
        const inside =
          pageX >= x && pageX <= x + width && pageY >= y && pageY <= y + height;

        if (!inside && onPressOutside) onPressOutside();
      },
    );
  };

  return (
    <Modal visible={open} animationType="slide" transparent>
      <View
        style={{ flex: 1, backgroundColor: 'black', padding: 20 }}
        onStartShouldSetResponder={() => true}
        onResponderRelease={handleTapOutside}
      >
        <Pressable
          onPress={onClose}
          style={{
            backgroundColor: '#3a3a3aff',
            alignSelf: 'flex-start',
            padding: 5,
            borderRadius: 5,
            marginBottom: 10,
          }}
        >
          <FontAwesomeIcon color="white" size={20} icon={faXmark} />
        </Pressable>

        {children}
      </View>
    </Modal>
  );
}
