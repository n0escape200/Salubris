import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Routes from './src/Routes';
import Footer from './src/Components/Footer';
import { navigationRef } from './src/Utils/NavigationRef';
import { NotificationProvider } from './src/Utils/Contexts/NotificationContext';
import { Notifications } from './src/Components/Notifications';
import { TrackingProvider } from './src/Utils/Contexts/TrackingContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function AppContent() {
  return (
    <>
      <Notifications />
      <NavigationContainer ref={navigationRef}>
        <Routes />
        <View style={{ height: 50 }} />
      </NavigationContainer>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TrackingProvider>
        <NotificationProvider>
          <SafeAreaProvider>
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: 'black',
              }}
            >
              <AppContent />
            </SafeAreaView>
          </SafeAreaProvider>
        </NotificationProvider>
      </TrackingProvider>
    </GestureHandlerRootView>
  );
}
