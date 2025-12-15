import { useContext, useEffect, useState } from 'react';
import Product from '../DB/Models/Product';
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
  const [product, setProduct] = useState<Product | null>(null);
  const { addNotification } = useNotification();
  const trackingContext = useContext(TrackingContext);
  useEffect(() => {
    line.product_id.fetch().then(setProduct);
  }, [line]);

  if (!product) return null;

  async function handleDeleteLine() {
    try {
      trackingContext?.removeTrackLine(line);
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
        <Text
          style={{
            ...styles.textxl,
            borderRadius: 15,
            backgroundColor: '#1c1c1c',
            borderWidth: 1,
            padding: 5,
            fontSize: 15,
          }}
        >
          {`#${index + 1}`}
        </Text>
        <View>
          <Text style={{ ...styles.textl, fontSize: 20 }}>
            {product.name.length > 20
              ? `${product.name.slice(0, 25)}...`
              : product.name}
          </Text>
          <Text style={{ fontSize: 12, color: 'white' }}>
            Quantity: {line.quantity}
            {line.unit}
          </Text>
        </View>
      </View>
      <Pressable onPress={handleDeleteLine}>
        <FontAwesomeIcon size={20} color="#f12144ff" icon={faTrash} />
      </Pressable>
    </View>
  );
}
