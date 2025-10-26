import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Routes from './src/Routes';
import { Text, View } from 'react-native';
import { styles } from './src/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          backgroundColor: 'black',
          height: '100%',
          paddingHorizontal: 20,
          paddingVertical: 10,
          position: 'relative',
        }}
      >
        <NavigationContainer>
          <Routes />
          <View style={{ height: 65 }} />
        </NavigationContainer>
        <View style={styles.footer}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon color="white" icon={faHouse} size={20} />
            <Text style={{ color: 'white', fontSize: 11 }}>Home</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon color="white" icon={faHouse} size={20} />
            <Text style={{ color: 'white', fontSize: 11 }}>Home</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon color="white" icon={faHouse} size={20} />
            <Text style={{ color: 'white', fontSize: 11 }}>Home</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon color="white" icon={faHouse} size={20} />
            <Text style={{ color: 'white', fontSize: 11 }}>Home</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon color="white" icon={faHouse} size={20} />
            <Text style={{ color: 'white', fontSize: 11 }}>Home</Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
