import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, DataTable, Text} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {connectToDatabase, getCustomerById} from '../../../services/db-service';
import {COMMON_COLORS} from '../../../resources/colors';
import {useRecoilValue} from 'recoil';
import {repIdAtom} from '../../../recoil/atoms';
import moment from 'moment';

const InvoicePrint = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const {
    invoiceData,
    total,
    totalDiscount,
    paymentAmount,
    inv,
    customerId,
    dateTime,
    saveInvoice,
    saveInvoiceDataPayload,
  } = route?.params;

  const repId = useRecoilValue(repIdAtom);

  const [customer, setCustomer] = useState<any>();

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const fetchCustomer = async () => {
    const db = await connectToDatabase();
    const customer: any = await getCustomerById(db, customerId);
    setCustomer(customer);
  };

  const handleSave = async () => {
    await saveInvoice(saveInvoiceDataPayload);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text variant="titleMedium">VSG Products</Text>
        <Text variant="labelSmall">Rajapaksha Road, Kothalawala Junction,</Text>
        <Text variant="labelSmall">Hingurakgoda</Text>
        <Text variant="labelSmall">Contact No: 0272555526, 0772530071</Text>
        <Text variant="labelSmall">Email : gsbvcy@gmail.com</Text>
      </View>
      <View style={styles.saleInvoiceTitleView}>
        <Text variant="titleLarge">SALES INVOICE</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 5,
        }}>
        <View style={styles.row}>
          <View>
            <Text variant="bodySmall">DATE/TIME</Text>
            <Text variant="bodySmall">TYPE</Text>
            <Text variant="bodySmall">CASHIER</Text>
          </View>
          <View>
            <Text variant="labelSmall">
              {' '}
              : {moment(dateTime).format('YYYY/MM/DD')}
            </Text>
            <Text variant="labelSmall"> : Sales Invoice</Text>
            <Text variant="labelSmall"> : {repId}</Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text variant="bodySmall" style={{textDecorationLine: 'underline'}}>
            Invoiced To
          </Text>
          <Text variant="labelSmall">
            {customer?.CustomerName} - ({customer?.CusId})
          </Text>
          <Text variant="labelSmall">{customer?.Add1}</Text>
          <Text variant="labelSmall">Contact No : {customer?.TeleNo1}</Text>
        </View>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Item Code</DataTable.Title>
          <DataTable.Title>Label Price</DataTable.Title>
          <DataTable.Title>Item Discount</DataTable.Title>
          <DataTable.Title>Unit Price</DataTable.Title>
          <DataTable.Title>Quantity</DataTable.Title>
          <DataTable.Title>Item Value</DataTable.Title>
        </DataTable.Header>

        {invoiceData?.map((item: any) => (
          <DataTable.Row key={item.key}>
            <DataTable.Cell>{item?.itemCode}</DataTable.Cell>
            <DataTable.Cell>{item?.labelPrice}</DataTable.Cell>
            <DataTable.Cell>{item?.itemDiscount}</DataTable.Cell>
            <DataTable.Cell>{item?.unitPrice}</DataTable.Cell>
            <DataTable.Cell>{item?.quantity}</DataTable.Cell>
            <DataTable.Cell>{item?.total}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>

      <View style={styles.summaryView}>
        <View>
          <Text variant="bodySmall">GROSS TOTAL</Text>
          <Text variant="bodySmall">SPECIAL DISCOUNT</Text>
          <Text variant="bodySmall">NET TOTAL</Text>
          <Text variant="bodySmall">PAYMENT</Text>
          <Text variant="bodySmall">CREDIT BALANCE</Text>
        </View>
        <View style={{marginLeft: 20}}>
          <Text variant="bodySmall">
            Rs: {parseFloat(total) + parseFloat(totalDiscount)}
          </Text>
          <Text variant="bodySmall">Rs: {totalDiscount}</Text>
          <Text variant="bodySmall">Rs: {total}</Text>
          <Text variant="bodySmall">Rs: {paymentAmount}</Text>
          <Text variant="bodySmall">
            Rs: {parseFloat(total) - parseFloat(paymentAmount)}
          </Text>
        </View>
      </View>
      <Text
        variant="labelSmall"
        style={{fontStyle: 'italic', textAlign: 'center'}}>
        Genarated By : AptSys Technologies 0777 968 510 www.aptsys.lk Print Date
        and Time : {moment(Date.now()).format('YYYY/MM/DD hh:mm A')}
      </Text>
      {saveInvoice !== null && (
        <Button
          style={styles.saveButton}
          mode="contained"
          buttonColor={COMMON_COLORS.SUCCESS.W900}
          onPress={handleSave}>
          SAVE
        </Button>
      )}
      <View style={{height: 50}}></View>
    </ScrollView>
  );
};

export default InvoicePrint;

const styles = StyleSheet.create({
  container: {padding: 10},
  modalContainer: {
    width: '100%',
  },
  saleInvoiceTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  row: {flexDirection: 'row'},
  summaryView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  signView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  signColumn: {flexDirection: 'column', alignItems: 'center'},
  saveButton: {
    marginHorizontal: 50,
    marginTop: 20,
    borderRadius: 8,
  },
});
