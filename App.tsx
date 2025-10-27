import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Routes from './src/Routes';
import { View } from 'react-native';
import Footer from './src/Components/Footer';
import { navigationRef } from './src/Utils/NavigationRef';

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
        <NavigationContainer ref={navigationRef}>
          <Routes />
          <View style={{ height: 55 }} />
        </NavigationContainer>
        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
