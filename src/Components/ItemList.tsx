import { Pressable, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import Product from '../DB/Models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { useContext } from 'react';
import { database } from '../DB/Database';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';

type ItemListProps = {
  product: Product;
};

export default function ItemList({ product }: ItemListProps) {
  const { addNotification } = useNotification();
  const trackingContext = useContext(TrackingContext);
  async function handleDeleteProduct() {
    try {
      await database.write(async () => {
        const productCollection = database.get<Product>('products');
        const productRecord = await productCollection.find(product.id || '');
        await productRecord.markAsDeleted();
      });

      const result = await trackingContext?.removeProduct(product);
      if (result === 1) {
        addNotification({
          type: 'SUCCESS',
          message: 'Product deleted successfully',
        });
      } else if (result === 2) {
        addNotification({
          type: 'ERROR',
          message: 'Cannot delete product because it is used in track lines',
        });
      } else {
        addNotification({ type: 'ERROR', message: 'Error deleting product' });
      }
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  const clampValue = (value?: number) =>
    value !== undefined ? value.toFixed(2) : '0.00';

  return (
    <View
      style={{
        backgroundColor: '#303030ff',
        padding: 10,
        borderRadius: 5,
        borderColor: '#696969ff',
        borderWidth: 2,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles.textxl}>
          {product?.name.length <= 25
            ? product?.name
            : `${product?.name.slice(0, 25)}...` || 'Product name'}
        </Text>
        <Pressable onPress={handleDeleteProduct}>
          <FontAwesomeIcon icon={faTrash} color="red" size={20} />
        </Pressable>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}
      >
        <Text style={styles.textl}>Kcal:</Text>
        <Text style={styles.textl}>{clampValue(product?.calories)}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}
      >
        <Text style={styles.textl}>Protein:</Text>
        <Text style={styles.textl}>{clampValue(product?.protein)}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}
      >
        <Text style={styles.textl}>Carbs:</Text>
        <Text style={styles.textl}>{clampValue(product?.carbs)}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 100,
        }}
      >
        <Text style={styles.textl}>Fats:</Text>
        <Text style={styles.textl}>{clampValue(product?.fats)}</Text>
      </View>
    </View>
  );
}
