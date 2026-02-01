import { Pressable, Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import Product from '../DB/Models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { useContext } from 'react';
import { database } from '../DB/Database';
import { TrackingContext } from '../Utils/Contexts/TrackingContext';

type ItemListProps = {
  product: Product;
  onEdit?: (product: Product) => void;
};

export default function ItemList({ product, onEdit }: ItemListProps) {
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
    value !== undefined ? value.toFixed(1) : '0.0';

  const formatName = (name: string) => {
    if (name.length <= 20) return name;
    return `${name.slice(0, 18)}...`;
  };

  return (
    <View style={styles.productCardCompact}>
      {/* Product Info */}
      <View style={styles.productInfoCompact}>
        <View style={styles.productHeaderCompact}>
          <Text style={styles.productNameCompact} numberOfLines={1}>
            {formatName(product?.name || 'Unnamed Product')}
          </Text>
          <Text style={styles.productUnitCompact}>per 100g</Text>
        </View>

        {/* Macros Row */}
        <View style={styles.macrosRowCompact}>
          <View style={styles.macroItemCompact}>
            <Text style={styles.macroValueCompact}>
              {clampValue(product?.calories)}
            </Text>
            <Text style={styles.macroLabelCompact}>cal</Text>
          </View>

          <View style={styles.macroDividerCompact} />

          <View style={styles.macroItemCompact}>
            <Text style={styles.macroValueCompact}>
              {clampValue(product?.protein)}
            </Text>
            <Text style={styles.macroLabelCompact}>P</Text>
          </View>

          <View style={styles.macroDividerCompact} />

          <View style={styles.macroItemCompact}>
            <Text style={styles.macroValueCompact}>
              {clampValue(product?.carbs)}
            </Text>
            <Text style={styles.macroLabelCompact}>C</Text>
          </View>

          <View style={styles.macroDividerCompact} />

          <View style={styles.macroItemCompact}>
            <Text style={styles.macroValueCompact}>
              {clampValue(product?.fats)}
            </Text>
            <Text style={styles.macroLabelCompact}>F</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsCompact}>
        {onEdit && (
          <Pressable
            onPress={() => onEdit(product)}
            style={styles.actionButtonCompact}
            hitSlop={8}
          >
            <FontAwesomeIcon icon={faEdit} size={16} color="#2196F3" />
          </Pressable>
        )}
        <Pressable
          onPress={handleDeleteProduct}
          style={styles.actionButtonCompact}
          hitSlop={8}
        >
          <FontAwesomeIcon icon={faTrash} size={16} color="#f44336" />
        </Pressable>
      </View>
    </View>
  );
}
