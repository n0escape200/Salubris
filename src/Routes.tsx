import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './Pages/Login';
import Vocabulary from './Vocabulary';

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={Vocabulary.login}
    >
      <Stack.Screen name={Vocabulary.login} component={Login} />
    </Stack.Navigator>
  );
}
