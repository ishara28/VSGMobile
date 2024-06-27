import * as React from 'react';
import {DataTable, Button, Text, Icon, IconButton} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface ItemsTableProps {
  data: any;
  getItemPrice: (item: any) => {};
}

const ItemsTable: React.FC<ItemsTableProps> = ({data, getItemPrice}) => {
  return (
    <DataTable style={styles.container}>
      <DataTable.Header>
        <DataTable.Title style={styles.cellContainer}>ItemCode</DataTable.Title>
        <DataTable.Title style={styles.cellContainer}>
          Grn_Index
        </DataTable.Title>
        <DataTable.Title style={styles.cellContainer}>Quantity</DataTable.Title>
        <DataTable.Title style={styles.cellContainer}></DataTable.Title>
      </DataTable.Header>

      {data.map((item: any) => (
        <DataTable.Row key={item.id}>
          <DataTable.Cell style={styles.cellContainer}>
            {item.ItemCode}
          </DataTable.Cell>
          <DataTable.Cell style={styles.cellContainer}>
            {item.Grn_Index}
          </DataTable.Cell>
          <DataTable.Cell style={styles.cellContainer}>
            {item.Quantity}
          </DataTable.Cell>
          <DataTable.Cell style={styles.cellContainer}>
            <IconButton
              icon="chevron-double-right"
              iconColor="white"
              style={{
                backgroundColor: COMMON_COLORS.SUCCESS.W900,
                borderRadius: 8,
              }}
              onPress={() => getItemPrice(item)}
              size={15}
            />
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COMMON_COLORS.WHITE,
    borderRadius: 8,
    marginVertical: 10,
  },
  cellContainer: {alignItems: 'center', justifyContent: 'center'},
});

export default ItemsTable;
