import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FONTS} from '../../../resources/fonts';
import {
  connectToDatabase,
  getCustomersList,
  getItemsByStockIdandCusId,
  getItemsGrnListByItemCodeandRepId,
  getItemsList,
} from '../../../services/db-service';
import ItemsTable from './ItemsTable';
import {Button, Icon, IconButton, Text, TextInput} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import InvoiceTable from './InvoiceTable';
import {useSnackbar} from '../../common/SnackbarContext';

const Home = () => {
  const {showSnackbar} = useSnackbar();
  const [shop, setShop] = useState(null || '');
  const [item, setItem] = useState('');
  const [repId, setRepId] = useState('REP1');
  const [isFocusShopDrodown, setIsFocusShopDrodown] = useState(false);
  const [isFocusItemDrodown, setIsItemShopDrodown] = useState(false);

  const [shopsList, setShopsList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [filteredItemsList, setFilteredItemsList] = useState([]);
  const [quantity, setQuantity] = useState();

  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [invoiceData, setInvoiceData] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    const db = await connectToDatabase();
    const result = await getCustomersList(db);
    setShopsList(result);
  };

  const fetchItems = async () => {
    const db = await connectToDatabase();
    const result = await getItemsList(db);
    setItemsList(result);
  };

  const filterItems = async (itemCode: string) => {
    const db = await connectToDatabase();
    const result = await getItemsGrnListByItemCodeandRepId(db, itemCode, repId);
    setFilteredItemsList(result);
  };

  const getItemPrice = async (item: any) => {
    const db = await connectToDatabase();
    const result = await getItemsByStockIdandCusId(db, item.SockId, shop);
    setSelectedItemDetails(result[0]);
  };

  const addToInvoice = () => {
    const itemExists = invoiceData.some(
      item => item.itemCode === selectedItemDetails.ItemCode,
    );

    if (!itemExists) {
      setInvoiceData([
        ...invoiceData,
        {
          itemCode: selectedItemDetails.ItemCode,
          itemName: item,
          labelPrice: selectedItemDetails.SalePrice,
          itemDiscount: 0,
          unitPrice: selectedItemDetails.SalePrice,
          quantity: quantity,
          total: quantity * selectedItemDetails.SalePrice,
        },
      ]);
    } else {
      showSnackbar(
        'Item with the same ItemCode already exists in the invoice.',
      );
    }
  };

  const removeInvoiceDataById = (id: String) => {
    setInvoiceData(invoiceData.filter(item => item?.itemCode !== id));
  };

  const clearInvoice = () => {
    setInvoiceData([]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}>
      <Dropdown
        style={[styles.dropdown, isFocusShopDrodown && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        data={shopsList}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusShopDrodown ? 'Select shop' : '...'}
        searchPlaceholder="Search..."
        value={shop}
        onFocus={() => setIsFocusShopDrodown(true)}
        onBlur={() => setIsFocusShopDrodown(false)}
        onChange={(i: any) => {
          setShop(i.value);
          setIsFocusShopDrodown(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusShopDrodown ? 'blue' : 'black'}
            name="search1"
            size={15}
          />
        )}
      />
      {shop && (
        <Dropdown
          style={[styles.dropdown, isFocusItemDrodown && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={styles.itemTextStyle}
          data={itemsList}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocusShopDrodown ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={item}
          onFocus={() => setIsItemShopDrodown(true)}
          onBlur={() => setIsItemShopDrodown(false)}
          onChange={(i: any) => {
            setItem(i.value);
            setIsItemShopDrodown(false);
            filterItems(i.value);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusItemDrodown ? 'blue' : 'black'}
              name="search1"
              size={15}
            />
          )}
        />
      )}
      {filteredItemsList.length > 0 && (
        <ItemsTable data={filteredItemsList} getItemPrice={getItemPrice} />
      )}
      {selectedItemDetails !== null && (
        <View>
          <View style={styles.selectedItemContainer}>
            <View>
              <Text variant="labelLarge">Price ID</Text>
              <Text variant="labelSmall">{selectedItemDetails?.PriceId}</Text>
            </View>
            <View>
              <Text variant="labelLarge">Item Code</Text>
              <Text variant="labelSmall">{selectedItemDetails?.ItemCode}</Text>
            </View>
            <View>
              <Text variant="labelLarge">Price</Text>
              <Text variant="labelSmall">{selectedItemDetails?.SalePrice}</Text>
            </View>
          </View>
          <View style={styles.addContainer}>
            <TouchableOpacity onPress={() => addToInvoice()}>
              <Icon
                source="plus-box"
                size={30}
                color={COMMON_COLORS.SUCCESS.W900}
              />
            </TouchableOpacity>
            <TextInput
              dense={true}
              style={{textAlign: 'center'}}
              keyboardType="numeric"
              mode="outlined"
              onChangeText={e => setQuantity(e)}
            />
            <Text style={styles.quantityLabel}>Quantity</Text>
          </View>
        </View>
      )}
      {invoiceData.length > 0 && (
        <InvoiceTable
          shop={shop}
          data={invoiceData}
          removeInvoiceDataById={removeInvoiceDataById}
          clearInvoice={clearInvoice}
        />
      )}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  contentContainerStyle: {paddingBottom: 60},
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    margin: 5,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS_MEDIUM,
  },
  itemTextStyle: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS_MEDIUM,
    color: COMMON_COLORS.GRAY.W600,
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS_MEDIUM,
    color: COMMON_COLORS.GRAY.W600,
  },
  iconStyle: {
    width: 20,
  },
  inputSearchStyle: {
    fontSize: 14,
    fontFamily: FONTS.POPPINS_MEDIUM,
    color: COMMON_COLORS.GRAY.W600,
  },
  selectedItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  addContainer: {
    flexDirection: 'row-reverse',
    padding: 10,
    alignItems: 'center',
  },
  quantityLabel: {
    marginRight: 20,
  },
});
