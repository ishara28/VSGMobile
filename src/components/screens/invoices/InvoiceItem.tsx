import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COMMON_COLORS} from '../../../resources/colors';
import {Dialog, IconButton, Portal, Text, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

const InvoiceItem = ({item, handleDelete}) => {
  const navigation = useNavigation();

  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);

  const hideDialog = () => setDialogVisible(false);

  const handleDeleteInvoice = async () => {
    await handleDelete(item);
    hideDialog();
  };

  const handleNavigation = () => {
    navigation.navigate('Invoice', {
      invoiceData: JSON.parse(item.InvDetails),
      total: item.InvoLabelPriceTotal,
      totalDiscount: item.InvoDiscount,
      paymentAmount: item.TotalPayment,
      dateTime: moment(item.InvoDate).format('YYYY-MM-DD'),
      inv: JSON.parse(item.InvDetails),
      customerId: item?.CusId,
      saveInvoice: null,
      saveInvoiceDataPayload: null,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{flex: 1}} onPress={handleNavigation}>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text variant="labelMedium">Invoice ID: {item.InvoNo}</Text>
          <Text variant="labelMedium">Customer ID: {item.CusId}</Text>
        </View>
        <View>
          <Text variant="labelSmall">
            Invoice Date:
            {new Date(parseInt(item.InvoDate)).toLocaleDateString()}
          </Text>
        </View>
        <Text variant="labelSmall">Total Payment: {item.TotalPayment}</Text>
      </TouchableOpacity>
      <View>
        <IconButton
          icon="delete"
          iconColor={COMMON_COLORS.ERROR.W900}
          onPress={() => showDialog()}
        />
      </View>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Do you want to delete this invoice?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDeleteInvoice}>Yes</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default InvoiceItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COMMON_COLORS.WHITE,
    borderRadius: 8,
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
