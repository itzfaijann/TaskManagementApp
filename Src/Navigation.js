import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './Tabs/Welcome';
import Signup from './Tabs/Signup';
import Login from './Tabs/Login';
import Main from './Tabs/Main';

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
       
        <Stack.Screen
          component={Welcome}
          name="Welcome"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={Signup}
          name="Signup"
          options={{ headerShown: false }}
        />
            <Stack.Screen
          component={Login}
          name="Login"
          options={{ headerShown: false }}
        />
           <Stack.Screen
          component={Main}
          name="Main"
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
