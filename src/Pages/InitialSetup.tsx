import { Text, View } from 'react-native';
import { styles } from '../Utils/Styles';

export default function InitialSetup() {
  return (
    <View style={styles.page}>
      <Text style={{ color: 'white' }}>Welcome to Salubris</Text>
      <Text style={{ color: 'white' }}>
        Helping you build better habits, one small step at a time
      </Text>
    </View>
  );
}
