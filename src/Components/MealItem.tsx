import { Pressable, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { styles } from '../Utils/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNotification } from '../Utils/Contexts/NotificationContext';
import { database } from '../DB/Database';
import Meal from '../DB/Models/Meal';

type MealProps = {
  meal: Meal;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit?: (meal: Meal) => void;
};

export default function MealItem({ meal, setRefresh, onEdit }: MealProps) {
  const { addNotification } = useNotification();

  async function handleDelete() {
    try {
      await database.write(async () => {
        await meal.markAsDeleted();
        addNotification({
          type: 'SUCCESS',
          message: `Meal "${meal.name}" deleted`,
        });
        setRefresh(true);
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  // Count products in meal
  const productCount = meal.products?.length || 0;

  // Format product list for preview
  const getProductPreview = () => {
    if (!meal.products || meal.products.length === 0) {
      return 'No products';
    }

    const firstProduct = meal.products[0];
    const remainingCount = meal.products.length - 1;

    if (remainingCount === 0) {
      return `${firstProduct.quantity}g`;
    }

    return `${firstProduct.quantity}g +${remainingCount} more`;
  };

  return (
    <View style={styles.mealCard}>
      {/* Meal Details */}
      <View style={styles.mealInfo}>
        <Text style={styles.mealName} numberOfLines={1}>
          {meal.name}
        </Text>
        <View style={styles.mealDetails}>
          <Text style={styles.mealProductCount}>
            {productCount} product{productCount !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.mealProductPreview}>{getProductPreview()}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.mealActions}>
        {onEdit && (
          <Pressable
            onPress={() => onEdit(meal)}
            style={styles.editButton}
            hitSlop={8}
          >
            <FontAwesomeIcon icon={faEdit} size={18} color="#2196F3" />
          </Pressable>
        )}
        <Pressable
          onPress={handleDelete}
          style={styles.deleteButton}
          hitSlop={8}
        >
          <FontAwesomeIcon icon={faTrash} size={18} color="#f44336" />
        </Pressable>
      </View>
    </View>
  );
}
