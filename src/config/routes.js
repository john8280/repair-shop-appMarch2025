import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Intake from '../screens/Intake';
import Home from '../screens/Home';
import Orders from '../screens/Orders';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen 
        name="Intake" 
        component={Intake} 
        options={{ title: 'New Repair Order' }}
      />
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="Orders" 
        component={Orders} 
        options={{ title: 'Repair Orders' }}
      />
    </Stack.Navigator>
  );
}