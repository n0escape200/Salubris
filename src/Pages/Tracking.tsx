import { View } from 'react-native';
import { styles } from '../Utils/Styles';
import MacroTracking from '../Components/MacroTracking';
import TabSelect from '../Components/TabSelect';

export default function Tracking() {
  return (
    <View style={styles.page}>
      <TabSelect />
      <MacroTracking />
    </View>
  );
}
