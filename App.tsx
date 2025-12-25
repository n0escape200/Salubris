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
import { Database, Q } from '@nozbe/watermelondb';
import { useEffect } from 'react';
import { database } from './src/DB/Database';
import { checkSetting } from './src/Utils/Functions';

async function initSettings() {
  await checkSetting('account_settings', 'smallWater', '100');
  await checkSetting('account_settings', 'mediumWater', '250');
  await checkSetting('account_settings', 'largeWater', '500');
}

async function backfillTrackLines(database: Database) {
  await database.write(async () => {
    // Fetch all track lines
    const trackLines: any = await database.get('track_lines').query().fetch();

    for (const line of trackLines) {
      // Only process lines that have product_id
      if (!('product_id' in line)) continue;

      try {
        const product: any = await database
          .get('products')
          .find(line.product_id);

        if (!product) {
          console.warn(`Product not found for line ${line.id}`);
          continue;
        }

        // Update the track line with name and macros
        await line.update((l: any) => {
          l.name = product.name;
          l.calories = product.calories;
          l.protein = product.protein;
          l.carbs = product.carbs;
          l.fats = product.fats;

          // Remove the old product_id field
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
