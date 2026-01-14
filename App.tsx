import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  NativeModules,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import Routes from './src/Routes';
import Footer from './src/Components/Footer';
import { navigationRef } from './src/Utils/NavigationRef';
import { NotificationProvider } from './src/Utils/Contexts/NotificationContext';
import { Notifications } from './src/Components/Notifications';
import { TrackingProvider } from './src/Utils/Contexts/TrackingContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Database } from '@nozbe/watermelondb';
import { useEffect } from 'react';
import { database } from './src/DB/Database';
import { checkSetting } from './src/Utils/Functions';
import StepCounterProvider from './src/Utils/Contexts/StepCounterContext';

const { StepCounterModule } = NativeModules;

async function initSettings() {
  await checkSetting('account_settings', 'smallWater', '100');
  await checkSetting('account_settings', 'mediumWater', '250');
  await checkSetting('account_settings', 'largeWater', '500');
}

async function requestActivityRecognitionPermission() {
  if (Platform.OS !== 'android') return true;

  if (Platform.Version >= 29) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      {
        title: 'Step Tracking Permission',
        message: 'We need access to your physical activity to track steps.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

async function backfillTrackLines(database: Database) {
  await database.write(async () => {
    const trackLines: any = await database.get('track_lines').query().fetch();

    for (const line of trackLines) {
      if (!('product_id' in line)) continue;

      try {
        const product: any = await database
          .get('products')
          .find(line.product_id);

        if (!product) {
          console.warn(`Product not found for line ${line.id}`);
          continue;
        }

        await line.update((l: any) => {
          l.name = product.name;
          l.calories = product.calories;
          l.protein = product.protein;
          l.carbs = product.carbs;
          l.fats = product.fats;
          delete l.product_id;
        });
      } catch (error) {
        console.warn(`Failed to backfill line ${line.id}:`, error);
      }
    }
  });
}

function AppContent() {
  useEffect(() => {
    backfillTrackLines(database);
    initSettings();
  }, []);

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
      <StepCounterProvider>
        <TrackingProvider>
          <NotificationProvider>
            <SafeAreaProvider>
              <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
                <AppContent />
              </SafeAreaView>
            </SafeAreaProvider>
          </NotificationProvider>
        </TrackingProvider>
      </StepCounterProvider>
    </GestureHandlerRootView>
  );
}
