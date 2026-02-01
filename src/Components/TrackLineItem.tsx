import { useContext } from 'react';
import TrackLine from '../DB/Models/TrackLine';
import { styles } from '../Utils/Styles';
import { Pressable, Text, View } from 'react-native';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';

type TrackLineItemProps = {
  line: TrackLine;
  index: number;
};

export default function TrackLineItem({ line, index }: TrackLineItemProps) {
  const { addNotification } = useNotification();
  const trackingContext = useContext(TrackingContext);

  async function handleDeleteLine() {
    try {
      await trackingContext?.removeTrackLine(line);
      addNotification({
        type: 'SUCCESS',
        message: 'Track line deleted successfully',
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  return (
    <View
      key={line.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2e2e2eff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#636363ff',
        marginBottom: 20,
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <View>
          <Text style={{ ...styles.textl, fontSize: 20 }}>
            {line.name
              ? line.name.length > 20
                ? `${line.name.slice(0, 25)}...`
                : line.name
              : ''}
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            <Text style={{ fontSize: 12, color: 'white' }}>
              Quantity: {line.quantity}
              {line.unit}
            </Text>
            <Text style={{ fontSize: 12, color: 'white' }}>
              Kcal: {line.calories}
            </Text>
          </View>
        </View>
      </View>
      <Pressable onPress={handleDeleteLine}>
        <FontAwesomeIcon size={20} color="#f12144ff" icon={faTrash} />
      </Pressable>
    </View>
  );
}
