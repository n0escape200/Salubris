import React, { ReactNode } from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  ScrollView,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

type CustomModalProps = {
  title?: string;
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  customStyle?: StyleProp<ViewStyle>;
};

export default function CustomModal(props: CustomModalProps) {
  const { title, open, onClose, children, customStyle } = props;

  if (!open) return null;

  return (
    <View style={[styles.overlay, customStyle]}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>{title ?? ''}</Text>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesomeIcon color="white" size={20} icon={faXmark} />
          </Pressable>
        </View>

        <View style={styles.contentContainer}>{children}</View>
      </View>
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
    zIndex: 1,
    padding: 10,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
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
});
