import {StyleSheet, View} from 'react-native';
import React from 'react';
import {COMMON_COLORS} from '../../../resources/colors';
import {IconButton, Text} from 'react-native-paper';

const InvoiceItem = ({item, handleDelete}) => {
  const handleDeleteInvoice = async () => {
    await handleDelete(item);
  };
  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Customer ID: {item.CusId}</Text>
        </View>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text variant="labelSmall">
            Invoice Date:{' '}
            {new Date(parseInt(item.InvoDate)).toLocaleDateString()}
          </Text>
          <Text variant="labelSmall">Invoice Type: {item.InvoType}</Text>
        </View>
        <Text>Total Payment: {item.TotalPayment}</Text>
      </View>
      <View>
        <IconButton
          icon="delete"
          iconColor={COMMON_COLORS.ERROR.W900}
          onPress={() => handleDeleteInvoice()}
        />
      </View>
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
