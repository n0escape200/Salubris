import { Text, View } from 'react-native';
import { styles } from '../Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';

export default function Home() {
  return (
    <View style={styles.page}>
      <View
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <FontAwesomeIcon icon={faUser} color="white" size={30} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: 'white', fontSize: 21 }}>Welcome back</Text>
          <Text style={{ color: 'white', fontSize: 17 }}>user</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.textxl}>Caories consume for the day</Text>
      </View>
    </View>
  );
}
