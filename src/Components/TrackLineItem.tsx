import { useContext } from 'react';
import TrackLine from '../DB/Models/TrackLine';
import { styles } from '../Utils/Styles';
import { Pressable, Text, View } from 'react-native';
import {
  faTrash,
  faEdit,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
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
        message: 'Deleted successfully',
      });
    } catch (error) {
      addNotification({ type: 'ERROR', message: `${error}` });
    }
  }

  // Calculate calories for this line
  const calculateLineCalories = () => {
    if (!line.calories || !line.quantity) return 0;
    const factor =
      line.unit === 'g' || line.unit === 'ml'
        ? line.quantity / 100
        : line.quantity;
    return Math.round(line.calories * factor);
  };

  // Calculate protein for this line
  const calculateLineProtein = () => {
    if (!line.protein || !line.quantity) return 0;
    const factor =
      line.unit === 'g' || line.unit === 'ml'
        ? line.quantity / 100
        : line.quantity;
    return Math.round(line.protein * factor * 10) / 10; // Round to 1 decimal
  };

  return (
    <View style={styles.productCardCompact}>
      {/* Left side: Product info */}
      <View style={styles.productInfoCompact}>
        <View style={styles.productHeaderCompact}>
          <Text style={styles.productNameCompact} numberOfLines={1}>
            {line.name || 'Unnamed Product'}
          </Text>
          <Text style={styles.productUnitCompact}>
            {line.quantity}
            {line.unit || 'g'}
          </Text>
        </View>

        <View style={styles.macrosRowCompact}>
          <View style={styles.macroItemCompact}>
            <Text style={styles.macroValueCompact}>
              {calculateLineCalories()}
            </Text>
            <Text style={styles.macroLabelCompact}>CAL</Text>
          </View>

          <View style={styles.macroDividerCompact} />

          <View style={styles.macroItemCompact}>
            <Text style={styles.macroValueCompact}>
              {calculateLineProtein()}
            </Text>
            <Text style={styles.macroLabelCompact}>PRO</Text>
          </View>

          {line.carbs && (
            <>
              <View style={styles.macroDividerCompact} />
              <View style={styles.macroItemCompact}>
                <Text style={styles.macroValueCompact}>
                  {Math.round(line.carbs * (line.quantity / 100) * 10) / 10}
                </Text>
                <Text style={styles.macroLabelCompact}>CARB</Text>
              </View>
            </>
          )}

          {line.fats && (
            <>
              <View style={styles.macroDividerCompact} />
              <View style={styles.macroItemCompact}>
                <Text style={styles.macroValueCompact}>
                  {Math.round(line.fats * (line.quantity / 100) * 10) / 10}
                </Text>
                <Text style={styles.macroLabelCompact}>FAT</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Right side: Actions */}
      <View style={styles.actionsCompact}>
        <Pressable
          onPress={handleDeleteLine}
          style={styles.actionButtonCompact}
        >
          <FontAwesomeIcon size={16} color="#f44336" icon={faTrash} />
        </Pressable>
      </View>
    </View>
  );
}
