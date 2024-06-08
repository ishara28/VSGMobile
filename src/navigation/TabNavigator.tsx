import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeStackScreen,
  InvoicesStackScreen,
  SettingsStackScreen,
} from './StackNavigator';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text} from 'react-native-paper';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: 'Home',
          headerTitle: () => <Text variant="titleMedium">Home</Text>,
          tabBarIcon: ({color}) => (
            <FontAwesome name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="InvoicesTab"
        component={InvoicesStackScreen}
        options={{
          title: 'Invoices',
          tabBarIcon: ({color}) => (
            <FontAwesome name="file-text" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({color}) => (
            <FontAwesome name="gear" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
