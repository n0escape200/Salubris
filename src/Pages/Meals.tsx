import { Text, View } from 'react-native';
import { styles } from '../Utils/Styles';
import Vocabulary from '../Utils/Vocabulary';

export default function Meals() {
  return (
    <View style={styles.page}>
      <Text style={styles.textxl}>{Vocabulary.meals}</Text>
    </View>
  );
}
