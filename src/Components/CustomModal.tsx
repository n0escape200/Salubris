import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Modal, Pressable, View } from 'react-native';
type CustomModalProps = {
  open: boolean;
  onClose: () => void;
};
export default function CustomModal(props: CustomModalProps) {
  const { open, onClose } = props;
  return (
    <Modal visible={open} animationType="slide" backdropColor={'black'}>
      <View style={{ padding: 20 }}>
        <Pressable
          onPress={onClose}
          style={{
            backgroundColor: '#3a3a3aff',
            alignSelf: 'flex-start',
            padding: 5,
            borderRadius: 5,
          }}
        >
          <FontAwesomeIcon color="white" size={20} icon={faXmark} />
        </Pressable>
      </View>
    </Modal>
  );
}
