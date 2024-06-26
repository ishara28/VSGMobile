import * as React from 'react';
import {Button, DataTable, Icon, Text, TextInput} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useState} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {repIdAtom, spinnerVisibleAtom} from '../../../recoil/atoms';
import {
  connectToDatabase,
  insertInvoice,
  reduceItemGrnQuantity,
} from '../../../services/db-service';
import {useSnackbar} from '../../common/SnackbarContext';
import ThermalPrinterModule from 'react-native-thermal-printer';
import {useNavigation} from '@react-navigation/native';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

interface InvoiceTableProps {
  shop: String;
  data: any;
  removeInvoiceDataById: (id: String) => void;
  clearInvoice: () => void;
}

ThermalPrinterModule.defaultConfig = {
  ...ThermalPrinterModule.defaultConfig,
  ip: '192.168.100.246',
  port: 9100,
  timeout: 30000,
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  shop,
  data,
  removeInvoiceDataById,
  clearInvoice,
}) => {
  const navigation = useNavigation();
  const repId = useRecoilValue(repIdAtom);
  const setSpinnerVisible = useSetRecoilState(spinnerVisibleAtom);
  const {showSnackbar} = useSnackbar();
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState(0);

  const calculateInvoiceTotal = () => {
    let total = 0;
    data.forEach(item => {
      total += item.total;
    });
    return total;
  };

  const calculateBillTotal = () => {
    let total = 0;
    data.forEach(item => {
      total += item.total;
    });
    return total - parseFloat(discount);
  };

  const handleProceed = () => {
    if (payment === 0) {
      showSnackbar('Please enter payment amount');
    } else {
      const invData = {
        invoiceData: data,
        total: calculateBillTotal(),
        totalDiscount: discount,
        paymentAmount: payment,
        selectedStore: shop,
        dateTime: Date.now(),
      };
      navigation.navigate('Invoice', {
        invoiceData: data,
        total: calculateBillTotal(),
        totalDiscount: discount,
        paymentAmount: payment,
        dateTime: Date.now(),
        inv: data,
        customerId: shop,
        saveInvoice: saveInvoice,
        saveInvoiceDataPayload: invData,
      });
    }
  };
  // TODO : createItemsGrnTable reduce Grn_Index
  const saveInvoice = async (invData: any) => {
    setSpinnerVisible(true);
    const invoiceEntity = {
      InvoType: 'Sales Invoice',
      InvoDate: Date.now().toString(),
      CusId: invData.selectedStore,
      RepId: repId,
      InvoMode: 'Credit',
      InvoCost: '',
      InvoLabelPriceTotal: invData.total.toString(),
      ItemDiscount: invData.totalDiscount.toString(),
      InvoSalePriceTotal: invData.invoiceData.total,
      InvoDiscount: invData.totalDiscount.toString(),
      InvoNetTotal: '0',
      TotalPayment: invData.paymentAmount.toString(),
      CreditBalance: (invData.total - invData.paymentAmount).toString(),
      PreOustanding: '00',
      IsReturn: 'false',
      ReturnInvoNo: '',
      InvDetails: JSON.stringify(invData.invoiceData),
      TransactionTime: '',
    };
    const db = await connectToDatabase();
    await insertInvoice(db, invoiceEntity);
    await reduceQuantitiesForData(db, data);
    clearInvoice();
    setSpinnerVisible(false);
    showSnackbar('Invoice saved successfully');
  };

  const reduceQuantitiesForData = async (db: SQLiteDatabase, data: any) => {
    try {
      for (const item of data) {
        const {grnIndex, quantity} = item;
        console.log('GRN Index: ' + grnIndex + ' Quantity: ' + quantity);
        await reduceItemGrnQuantity(db, grnIndex, quantity);
      }
      console.log('All quantities reduced successfully');
    } catch (error) {
      console.log('Error reducing quantities for data', error);
    }
  };

  const printInvoice = async (invData: any) => {
    try {
      console.log('We will invoke the native module here!');
      const receiptText = buildReceiptText(invData);
      // bluetooth
      await ThermalPrinterModule.printBluetooth({payload: receiptText});
      console.log('done printing');
    } catch (err) {
      //error handling
      console.log(err.message);
    }
  };

  const buildReceiptText = (invoice: any) => {
    const {invoiceData, paymentAmount, selectedStore, total, totalDiscount} =
      invoice;
    const formattedDate = new Date(invoice.dateTime).toLocaleString();

    let itemsText = invoiceData
      .map(
        (item: any) =>
          `[L]<b>${item.itemName}</b>[R]${item.unitPrice}\n` +
          `[L]  + Quantity: ${item.quantity}\n` +
          `[L]  + Total: ${item.total}\n`,
      )
      .join('[L]\n');

    return (
      `[C]<img>https://via.placeholder.com/300.jpg</img>\n` +
      `[L]\n` +
      `[C]<u><font size='big'>ORDER DETAILS</font></u>\n` +
      `[L]\n` +
      `[L]Date: ${formattedDate}\n` +
      `[L]Store: ${selectedStore}\n` +
      `[L]================================\n` +
      `[L]\n` +
      itemsText +
      `[L]\n` +
      `[C]--------------------------------\n` +
      `[R]TOTAL :[R]${total}\n` +
      `[R]DISCOUNT :[R]${totalDiscount}\n` +
      `[R]PAYMENT :[R]${paymentAmount}\n` +
      `[L]\n` +
      `[C]================================\n`
    );
  };

  return (
    <View>
      <Text>Invoice Details</Text>
      <DataTable style={styles.container}>
        <DataTable.Header>
          <DataTable.Title style={styles.cellContainer}>Name</DataTable.Title>
          <DataTable.Title style={styles.cellContainer}>
            Quantity
          </DataTable.Title>
          <DataTable.Title style={styles.cellContainer}>Total</DataTable.Title>
          <DataTable.Title style={styles.cellContainer}></DataTable.Title>
        </DataTable.Header>

        {data.map((item: any) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell style={styles.cellContainer}>
              <Text style={{fontSize: 11}}>{item.itemName}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={styles.cellContainer}>
              {item.quantity}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cellContainer}>
              {item.total}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cellContainer}>
              <TouchableOpacity
                onPress={() => removeInvoiceDataById(item.grnIndex)}>
                <Icon
                  source="delete"
                  size={20}
                  color={COMMON_COLORS.ERROR.W800}
                />
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
        <Text style={{textAlign: 'right', margin: 10}}>
          Total: {calculateInvoiceTotal()}
        </Text>
      </DataTable>
      <View style={styles.discountView}>
        <View style={{flex: 1}}>
          <TextInput
            placeholder="Discount"
            mode="outlined"
            dense
            keyboardType="numeric"
            contentStyle={{fontSize: 14}}
            style={{flex: 1}}
            value={discount}
            onChangeText={setDiscount}
          />
        </View>
        <View style={{flex: 1, marginLeft: 20}}>
          <TextInput
            placeholder="Payment"
            mode="outlined"
            dense
            keyboardType="numeric"
            contentStyle={{fontSize: 14}}
            style={{flex: 1}}
            value={payment}
            onChangeText={setPayment}
          />
        </View>
      </View>
      <View style={styles.proceedBtnView}>
        <Button
          style={{borderRadius: 8}}
          contentStyle={{flexDirection: 'row-reverse'}}
          mode="contained"
          icon={'play'}
          buttonColor={COMMON_COLORS.SUCCESS.W900}
          onPress={() => handleProceed()}>
          Proceed
        </Button>
        <Text>Amout to Pay : {calculateBillTotal()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COMMON_COLORS.WHITE,
    borderRadius: 8,
    marginVertical: 10,
  },
  cellContainer: {alignItems: 'center', justifyContent: 'center'},
  discountView: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
  },
  proceedBtnView: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default InvoiceTable;
