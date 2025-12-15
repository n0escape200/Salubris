import React, { ReactNode, useEffect, useRef } from 'react';
import {
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

type CustomModalProps = {
  title?: string;
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  overlayStyle?: ViewStyle;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CustomModal(props: CustomModalProps) {
  const { title, open, onClose, children, overlayStyle } = props;

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: open ? 0 : SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, slideAnim]);

  if (!open) return null;

  return (
    <View style={[styles.overlay, overlayStyle]}>
      <Animated.View
        style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title ?? ''}</Text>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesomeIcon color="white" size={20} icon={faXmark} />
          </Pressable>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.content}
        >
          {children}
        </ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 9999,
  },
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  closeButton: {
    backgroundColor: '#3a3a3aff',
    padding: 5,
    borderRadius: 5,
  },
  content: {
    paddingBottom: 40,
  },
});
