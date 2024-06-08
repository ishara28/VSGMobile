import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import TabNavigator from './TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import Login from '../components/screens/login/Login';
import {createStackNavigator} from '@react-navigation/stack';

const Navigator = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;

const styles = StyleSheet.create({});
