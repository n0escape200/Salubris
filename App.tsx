import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Routes from './src/Routes';
import Footer from './src/Components/Footer';
import { navigationRef } from './src/Utils/NavigationRef';
import { NotificationProvider } from './src/Utils/NotificationContext';
import { Notifications } from './src/Components/Notifications';

function AppContent() {
  return (
    <>
      <Notifications />
      <NavigationContainer ref={navigationRef}>
        <Routes />
        <View style={{ height: 55 }} />
      </NavigationContainer>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'black',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <AppContent />
        </SafeAreaView>
      </SafeAreaProvider>
    </NotificationProvider>
  );
}
