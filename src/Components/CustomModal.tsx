import React, { ReactNode, RefObject, useEffect, useRef } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  ScrollView,
  Text,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

type AnyRef = RefObject<any> | RefObject<any>[];

type CustomModalProps = {
  title?: string;
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  /**
   * Accept either a single RefObject or an array of RefObjects to check against.
   */
  childRef?: AnyRef;
  onPressOutside?: () => void;
  overlayStyle?: ViewStyle;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Box = { x: number; y: number; width: number; height: number };

/** helper to measure a single ref using measureInWindow and return a Promise<Box|null> */
const measureRef = (ref: RefObject<any>): Promise<Box | null> =>
  new Promise(resolve => {
    try {
      if (!ref?.current || typeof ref.current.measureInWindow !== 'function') {
        resolve(null);
        return;
      }

      // measureInWindow(callback(x, y, width, height))
      ref.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          // if width/height are zero, view might not be laid out yet; still return the values
          resolve({ x, y, width, height });
        },
      );
    } catch (err) {
      // measurement failed (e.g., wrong ref type)
      resolve(null);
    }
  });

/** normalize childRef prop to array of refs */
const normalizeRefs = (childRef?: AnyRef): RefObject<any>[] => {
  if (!childRef) return [];
  if (Array.isArray(childRef)) return childRef;
  return [childRef];
};

export default function CustomModal(props: CustomModalProps) {
  const {
    title,
    open,
    onClose,
    children,
    childRef,
    onPressOutside,
    overlayStyle,
  } = props;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // starts off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: open ? 0 : SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, slideAnim]);

  if (!open) return null;

  const handleTapOutside = async (evt: GestureResponderEvent) => {
    // If there's no onPressOutside, nothing to do
    if (!onPressOutside) return;

    const refs = normalizeRefs(childRef);
    if (refs.length === 0) {
      // no refs provided => treat every tap as outside
      onPressOutside();
      return;
    }

    const { pageX, pageY } = evt.nativeEvent;

    // measure all refs in parallel
    const measurements = await Promise.all(refs.map(r => measureRef(r)));

    // check if the touch is inside any measured box
    const touchedInsideAny = measurements.some(box => {
      if (!box) return false;
      return (
        pageX >= box.x &&
        pageX <= box.x + box.width &&
        pageY >= box.y &&
        pageY <= box.y + box.height
      );
    });

    if (!touchedInsideAny) {
      onPressOutside();
    }
  };

  return (
    <ScrollView
      style={[styles.overlay, overlayStyle]}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleTapOutside}
    >
      <Animated.View
        style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>
            {title ? title : ''}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesomeIcon color="white" size={20} icon={faXmark} />
          </Pressable>
        </View>

        {children}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 9999,
  },
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
  },
  closeButton: {
    backgroundColor: '#3a3a3aff',
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
});
