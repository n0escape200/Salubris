import { Text, View } from 'react-native';
import { styles } from '../Styles';

export default function Calories() {
  return (
    <View style={styles.page}>
      <Text style={styles.textxl}>Calories consumed today</Text>
      <View style={styles.container}></View>
    </View>
  );
}
