import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Button, Dialog, Portal} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import axios from 'axios';
import {
  API_INVOICE_UPDATE_ENDPOINT,
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
  emptyTable,
  getAllInvoices,
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

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const handleResetAll = async () => {
    hideDialog();
  };

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

  const syncSales = async () => {
    setSpinnerVisible(true);
    const db = await connectToDatabase();
    const result = await getAllInvoices(db);
    const requestBody = {
      invoices: result,
    };
    await axios
      .post(API_INVOICE_UPDATE_ENDPOINT, requestBody)
      .then(res => {
        console.log(res);
        setSpinnerVisible(false);
      })
      .catch(error => {
        console.log(error);
      });
    setSpinnerVisible(false);
  };

  const clearTables = async () => {
    setSpinnerVisible(true);
    const db = await connectToDatabase();
    await emptyTable(db, 'invoices');
    await emptyTable(db, 'invoice_details');
    await emptyTable(db, 'invoice_payments');
    await emptyTable(db, 'items');
    await emptyTable(db, 'items_grn');
    await emptyTable(db, 'items_prices');
    await emptyTable(db, 'customers');
    setSpinnerVisible(false);
  };

  const showLogoutDialog = () => {
    setDialogTitle('Logout');
    setDialogMessage('Are you sure you want to logout?');
    showDialog();
  };

  const showClearTablesDialog = () => {
    setDialogTitle('Clear Tables');
    setDialogMessage('Are you sure you want to clear all tables?');
    showDialog();
  };

  const handleOnDialogConfirm = async () => {
    setSpinnerVisible(true);
    hideDialog();
    if (dialogTitle === 'Logout') {
      handleLogout();
    } else if (dialogTitle === 'Clear Tables') {
      clearTables();
    }
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
        onPress={() => syncProducts()}
        icon={'sync'}>
        Sync Products
      </Button>
      <Button
        mode="contained"
        style={[styles.button, styles.btn2]}
        onPress={() => syncSales()}
        icon={'sync'}>
        Sync Sales
      </Button>
      <Button
        mode="contained"
        style={[styles.button, styles.btn3]}
        onPress={() => synCustomers()}
        icon={'sync'}>
        Sync Customers
      </Button>
      <Button
        mode="contained"
        style={[styles.button, styles.btn4]}
        onPress={() => syncInvoices()}
        icon={'upload'}>
        Sync Invoices
      </Button>
      <Button
        mode="contained"
        style={[styles.button, styles.btn5]}
        onPress={() => showClearTablesDialog()}
        icon={'delete-alert'}>
        Clear DB
      </Button>
      <Button
        mode="contained"
        style={[styles.button, styles.btn6]}
        onPress={() => showLogoutDialog()}
        icon={'logout'}>
        Logout
      </Button>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleOnDialogConfirm}>Yes</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    backgroundColor: COMMON_COLORS.ERROR.W900,
  },
  btn6: {
    backgroundColor: COMMON_COLORS.BLACK,
  },
});
