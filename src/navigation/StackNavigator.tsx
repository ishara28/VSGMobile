import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../components/screens/home/Home';
import Settings from '../components/screens/settings/Settings';
import {Text} from 'react-native-paper';
import Invoices from '../components/screens/invoices/Invoices';
import InvoicePrint from '../components/screens/home/InvoicePrint';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: () => <Text variant="titleMedium">Home</Text>,
          headerLeft: () => null,
        }}
      />
      <HomeStack.Screen
        name="Invoice"
        component={InvoicePrint}
        options={{
          headerTitle: () => <Text variant="titleMedium">Invoice</Text>,
        }}
      />
    </HomeStack.Navigator>
  );
};

const SettingsStack = createStackNavigator();

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: () => <Text variant="titleMedium">Settings</Text>,
          headerLeft: () => null,
        }}
      />
    </SettingsStack.Navigator>
  );
};

const InvoicesStack = createStackNavigator();

const InvoicesStackScreen = () => {
  return (
    <InvoicesStack.Navigator>
      <InvoicesStack.Screen
        name="Invoices"
        component={Invoices}
        options={{
          headerTitle: () => <Text variant="titleMedium">Invoices</Text>,
          headerLeft: () => null,
        }}
      />
      <InvoicesStack.Screen
        name="Invoice"
        component={InvoicePrint}
        options={{
          headerTitle: () => <Text variant="titleMedium">Invoice</Text>,
        }}
      />
    </InvoicesStack.Navigator>
  );
};

export {HomeStackScreen, SettingsStackScreen, InvoicesStackScreen};
