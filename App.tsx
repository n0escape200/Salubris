import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  NativeModules,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Database } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';

// Components & Pages
import Footer from './src/Components/Footer';
import { Notifications } from './src/Components/Notifications';

// Context Providers
import { NotificationProvider } from './src/Utils/Contexts/NotificationContext';
import { TrackingProvider } from './src/Utils/Contexts/TrackingContext';
import StepCounterProvider from './src/Utils/Contexts/StepCounterContext';

// Utils & Database
import { navigationRef } from './src/Utils/NavigationRef';
import { database } from './src/DB/Database';
import { checkSetting } from './src/Utils/Functions';
import MainPager from './src/MainPager';
import { PagerProvider } from './src/Utils/Contexts/PageContext';
import InitialSetup from './src/Pages/InitialSetup';

const { StepCounterModule } = NativeModules;
const Stack = createNativeStackNavigator();

// Helper Functions
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
  const [footerHeight, setFooterHeight] = useState(0);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    backfillTrackLines(database);
    initSettings();
  }, []);

  return (
    <>
      <Notifications />

      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setCurrentRoute(navigationRef.getCurrentRoute()?.name ?? null);
        }}
        onStateChange={() => {
          setCurrentRoute(navigationRef.getCurrentRoute()?.name ?? null);
        }}
      >
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="MainPager"
        >
          <Stack.Screen name="MainPager" component={MainPager} />
          <Stack.Screen name="InitialSetup" component={InitialSetup} />
        </Stack.Navigator>

        <View style={{ height: footerHeight > 0 ? footerHeight : 60 }} />
      </NavigationContainer>

      {currentRoute !== 'InitialSetup' && (
        <View
          style={{ paddingBottom: insets.bottom }}
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            setFooterHeight(height);
          }}
        >
          <Footer />
        </View>
      )}
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StepCounterProvider>
        <TrackingProvider>
          <NotificationProvider>
            <PagerProvider>
              <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
                  <AppContent />
                </SafeAreaView>
              </SafeAreaProvider>
            </PagerProvider>
          </NotificationProvider>
        </TrackingProvider>
      </StepCounterProvider>
    </GestureHandlerRootView>
  );
}
