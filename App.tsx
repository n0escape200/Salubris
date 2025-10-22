import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Routes from './src/Routes';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          backgroundColor: 'black',
          height: '100%',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
