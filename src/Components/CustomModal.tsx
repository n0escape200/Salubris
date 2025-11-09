import { ReactNode, RefObject, useEffect, useRef } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CustomModal(props: CustomModalProps) {
  const { open, onClose, children, childRef, onPressOutside } = props;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // starts off-screen

  useEffect(() => {
    if (open) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [open, slideAnim]);

  if (!open) return null; // modal is hidden

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
    <View
      style={styles.overlay}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleTapOutside}
    >
      <Animated.View
        style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
      >
        <Pressable onPress={onClose} style={styles.closeButton}>
          <FontAwesomeIcon color="white" size={20} icon={faXmark} />
        </Pressable>

        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black', // full black background
    zIndex: 9999,
  },
  modal: {
    flex: 1, // full-screen modal
    padding: 20,
    backgroundColor: 'black', // match background
    justifyContent: 'flex-start', // content starts from top
  },
  closeButton: {
    backgroundColor: '#3a3a3aff',
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});
