import { View, Text } from 'react-native';
import { styles } from '../../Utils/Styles';

type HeaderSectionProps = {
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
};

export default function HeaderSection({ macros }: HeaderSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Daily Intake</Text>

      <View style={styles.macrosGrid}>
        <View style={styles.macroColumn}>
          <Text style={styles.macroLabel}>Calories:</Text>
          <Text style={styles.macroLabel}>Protein:</Text>
          <Text style={styles.macroLabel}>Carbs:</Text>
          <Text style={styles.macroLabel}>Fat:</Text>
        </View>

        <View style={styles.macroColumn}>
          <Text style={styles.macroValue}>
            {macros?.calories.toFixed(0) || '0'}
          </Text>
          <Text style={styles.macroValue}>
            {macros?.protein.toFixed(1) || '0.0'}g
          </Text>
          <Text style={styles.macroValue}>
            {macros?.carbs.toFixed(1) || '0.0'}g
          </Text>
          <Text style={styles.macroValue}>
            {macros?.fats.toFixed(1) || '0.0'}g
          </Text>
        </View>
      </View>
    </View>
  );
}
