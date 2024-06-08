import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import axios from 'axios';
import {
  CUSTOMER_ENDPOINT,
  ITEMS_ENDPOINT,
  ITEMS_GRN_ENDPOINT,
  ITEMS_PRICE_ENDPOINT,
} from '../../../constants/urls';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {isLoggedInAtom, spinnerVisibleAtom} from '../../../recoil/atoms';
import {
  connectToDatabase,
  createCustomerTable,
  createInvoiceDetailsTable,
  createInvoicePaymentsTable,
  createInvoicesTable,
  createItemsGrnTable,
  createItemsPricesTable,
  createItemsTable,
  insertCustomers,
  insertItems,
  insertItemsGrn,
  insertItemsPrices,
} from '../../../services/db-service';
import {useNavigation} from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();
  const setSpinnerVisible = useSetRecoilState(spinnerVisibleAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  const synCustomers = async () => {
    setSpinnerVisible(true);
    const response = await axios.get(CUSTOMER_ENDPOINT);
    const db = await connectToDatabase();
    await createCustomerTable(db);
    await insertCustomers(db, response.data);
    setSpinnerVisible(false);
  };

  const syncProducts = async () => {
    setSpinnerVisible(true);
    const items = await axios.get(ITEMS_ENDPOINT);
    const items_grn = await axios.get(ITEMS_GRN_ENDPOINT);
    const items_price = await axios.get(ITEMS_PRICE_ENDPOINT);
    const db = await connectToDatabase();
    await createItemsTable(db);
    await createItemsGrnTable(db);
    await createItemsPricesTable(db);
    await insertItems(db, items.data);
    await insertItemsGrn(db, items_grn.data);
    await insertItemsPrices(db, items_price.data);
    setSpinnerVisible(false);
  };

  const syncInvoices = async () => {
    setSpinnerVisible(true);
    const db = await connectToDatabase();
    await createInvoicesTable(db);
    await createInvoiceDetailsTable(db);
    await createInvoicePaymentsTable(db);
    setSpinnerVisible(false);
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={[styles.button, styles.btn1]}
        onPress={() => syncProducts()}>
        Sync Products
      </Button>
      <Button mode="contained" style={[styles.button, styles.btn2]}>
        Sync Sales
      </Button>
      <Button
        mode="contained"
        style={[styles.button, styles.btn3]}
        onPress={() => synCustomers()}>
        Sync Customers
      </Button>
      <Button
        mode="contained"
        style={[styles.button, styles.btn4]}
        onPress={() => syncInvoices()}>
        Sync Invoices
      </Button>
      <Button
        mode="contained"
        style={[styles.button, styles.btn5]}
        onPress={() => handleLogout()}>
        Logout
      </Button>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {padding: 20},
  button: {
    borderRadius: 8,
    margin: 10,
  },
  btn1: {
    backgroundColor: COMMON_COLORS.WARNING.W900,
  },
  btn2: {
    backgroundColor: COMMON_COLORS.INFO.W900,
  },
  btn3: {
    backgroundColor: COMMON_COLORS.LUXARY.W900,
  },
  btn4: {
    backgroundColor: COMMON_COLORS.SUCCESS.W900,
  },
  btn5: {
    backgroundColor: COMMON_COLORS.BLACK,
  },
});
