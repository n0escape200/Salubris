import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './Pages/Login';
import Home from './Pages/Home';
import Products from './Pages/Products';
import Tracking from './Pages/Tracking';
import Map from './Pages/Map';
import User from './Pages/User';
import Vocabulary from './Utils/Vocabulary';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      initialRouteName={Vocabulary.home}
    >
      <Stack.Screen name={Vocabulary.login} component={Login} />
      <Stack.Screen name={Vocabulary.home} component={Home} />
      <Stack.Screen name={Vocabulary.tracking} component={Tracking} />
      <Stack.Screen name={Vocabulary.products} component={Products} />
      <Stack.Screen name={Vocabulary.map} component={Map} />
      <Stack.Screen name={Vocabulary.user} component={User} />
    </Stack.Navigator>
  );
}
