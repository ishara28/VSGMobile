import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  connectToDatabase,
  deleteInvoiceById,
  getAllInvoices,
} from '../../../services/db-service';
import {useSetRecoilState} from 'recoil';
import {spinnerVisibleAtom} from '../../../recoil/atoms';
import InvoiceItem from './InvoiceItem';
import {useIsFocused} from '@react-navigation/native';
import {Text} from 'react-native-paper';

const Invoices = () => {
  const setSpinnerVisible = useSetRecoilState(spinnerVisibleAtom);
  const isFocussed = useIsFocused();

  const [invoices, setInvoices] = useState([]);
  useEffect(() => {
    if (isFocussed) fetchInvoices();
  }, [isFocussed]);

  const fetchInvoices = async () => {
    setSpinnerVisible(true);
    const db = await connectToDatabase();
    const invoices = await getAllInvoices(db);
    setInvoices(invoices);
    setSpinnerVisible(false);
  };

  const handleDelete = async (item: any) => {
    setSpinnerVisible(true);
    const db = await connectToDatabase();
    await deleteInvoiceById(db, item.InvoNo);
    await fetchInvoices();
    setSpinnerVisible(false);
  };

  return (
    <View style={styles.container}>
      {invoices.length === 0 && <Text>No Invoices</Text>}
      <FlatList
        data={invoices}
        renderItem={({item}) => (
          <InvoiceItem item={item} handleDelete={handleDelete} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Invoices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
