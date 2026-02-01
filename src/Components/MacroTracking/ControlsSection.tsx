import { View, Pressable, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faPlus,
  faUtensils,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import CustomButton from '../CustomButton';
import { styles } from '../../Utils/Styles';

type ControlsSectionProps = {
  onOpenProductModal: () => void;
  onOpenMealModal: () => void;
  onOpenDatePicker: () => void;
  onReset: () => void;
  date: Date;
};

export default function ControlsSection({
  onOpenProductModal,
  onOpenMealModal,
  onOpenDatePicker,
  onReset,
  date,
}: ControlsSectionProps) {
  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <View style={styles.controlsContainer}>
      <View style={styles.buttonGroup}>
        {/* Meal Button */}
        <Pressable
          onPress={onOpenMealModal}
          style={[styles.actionButton, styles.mealButton]}
        >
          <FontAwesomeIcon icon={faUtensils} size={17} color="#fff" />
          <Text style={styles.buttonText}>Meal</Text>
        </Pressable>

        {/* Product Button */}
        <Pressable
          onPress={onOpenProductModal}
          style={[styles.actionButton, styles.productButton]}
        >
          <FontAwesomeIcon icon={faPlus} size={17} color="#fff" />
          <Text style={styles.buttonText}>Item</Text>
        </Pressable>

        {/* Date Button */}
        <Pressable
          onPress={onOpenDatePicker}
          style={[styles.actionButton, styles.dateButton]}
        >
          <FontAwesomeIcon icon={faCalendar} size={17} color="#fff" />
          <Text style={styles.buttonText}>{formatDate(date)}</Text>
        </Pressable>
      </View>

      {/* Reset Button */}
      <View style={styles.resetContainer}>
        <CustomButton
          label="Reset to Today"
          fontSize={14}
          onPress={onReset}
          customStyle={styles.resetButton}
        />
      </View>
    </View>
  );
}
