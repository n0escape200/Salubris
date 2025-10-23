import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './Pages/Login';
import Vocabulary from './Vocabulary';
import Home from './Pages/Home';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={Vocabulary.home}
    >
      <Stack.Screen name={Vocabulary.login} component={Login} />
      <Stack.Screen name={Vocabulary.home} component={Home} />
    </Stack.Navigator>
  );
}
