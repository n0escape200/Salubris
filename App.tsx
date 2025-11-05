import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Button } from 'react-native';
import Routes from './src/Routes';
import Footer from './src/Components/Footer';
import { navigationRef } from './src/Utils/NavigationRef';
import {
  NotificationProvider,
  useNotification,
} from './src/Utils/NotificationContext';
import { notificationTypes } from './src/Utils/Constants';
import { Notifications } from './src/Components/Notifications';

function DemoButtons() {
  const { addNotification } = useNotification();

  return (
    <View style={{ marginVertical: 20 }}>
      <Button
        title="Add Error"
        onPress={() =>
          addNotification({
            type: notificationTypes[0],
            message: 'Error occurred!',
          })
        }
      />
      <Button
        title="Add Success"
        onPress={() =>
          addNotification({
            type: notificationTypes[1],
            message: 'Operation successful!',
          })
        }
      />
    </View>
  );
}

function AppContent() {
  return (
    <>
      <Notifications />
      <NavigationContainer ref={navigationRef}>
        <Routes />
        <DemoButtons />
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
