import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPager from './MainPager';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name={Vocabulary.login} component={Login} /> */}
      <Stack.Screen name="MainPager" component={MainPager} />
    </Stack.Navigator>
  );
}
