import * as React from 'react';
import {Button, DataTable, Icon, Text, TextInput} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useState} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {repIdAtom, spinnerVisibleAtom} from '../../../recoil/atoms';
import {connectToDatabase, insertInvoice} from '../../../services/db-service';
import {useSnackbar} from '../../common/SnackbarContext';

interface InvoiceTableProps {
  shop: String;
  data: any;
  removeInvoiceDataById: (id: String) => void;
  clearInvoice: () => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  shop,
  data,
  removeInvoiceDataById,
  clearInvoice,
}) => {
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
    const invData = {
      invoiceData: data,
      total: calculateBillTotal(),
      totalDiscount: discount,
      paymentAmount: payment,
      selectedStore: shop,
      dateTime: Date.now(),
    };
    saveInvoice(invData);
  };
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
    clearInvoice();
    setSpinnerVisible(false);
    showSnackbar('Invoice saved successfully');
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
              {item.itemName}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cellContainer}>
              {item.quantity}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cellContainer}>
              {item.total}
            </DataTable.Cell>
            <DataTable.Cell style={styles.cellContainer}>
              <TouchableOpacity
                onPress={() => removeInvoiceDataById(item.itemCode)}>
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
