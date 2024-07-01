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
import {
  Button,
  Dialog,
  Icon,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import InvoiceTable from './InvoiceTable';
import {useSnackbar} from '../../common/SnackbarContext';
import {useIsFocused} from '@react-navigation/native';
import {useRecoilValue} from 'recoil';
import {repIdAtom} from '../../../recoil/atoms';

const Home = () => {
  const {showSnackbar} = useSnackbar();
  const isFocussed = useIsFocused();
  const [shop, setShop] = useState(null || '');
  const [shopAddress, setShopAddress] = useState('');
  const [item, setItem] = useState('');
  const [itemName, setItemName] = useState('');
  const repId = useRecoilValue(repIdAtom);
  const [isFocusShopDrodown, setIsFocusShopDrodown] = useState(false);
  const [isFocusItemDrodown, setIsItemShopDrodown] = useState(false);

  const [shopsList, setShopsList] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [filteredItemsList, setFilteredItemsList] = useState([]);
  const [quantity, setQuantity] = useState();
  const [expandedItem, setExpandedItem] = useState();

  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [invoiceData, setInvoiceData] = useState([]);

  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const handleResetAll = async () => {
    setInvoiceData([]);
    setSelectedItemDetails(null);
    setShop(null || '');
    setItem('');
    hideDialog();
    setShopAddress("");
    setShop("");
    console.log(selectedItemDetails)
  };

  useEffect(() => {
    if (isFocussed) {
      fetchCustomers();
      fetchItems();
    }
  }, [isFocussed]);

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
    setExpandedItem(item);
    const db = await connectToDatabase();
    const result = await getItemsByStockIdandCusId(db, item.SockId, shop);
    console.log('PRICE ::: ', result.length);
    if(result.length > 0){
        setSelectedItemDetails({...result[0], grnIndex: item.Grn_Index});
    }else{
        showSnackbar(
            'Prices are not allocated for this product',
        );
    }

  };

  const addToInvoice = () => {
    if (expandedItem.Quantity >= quantity) {
      const itemExists = invoiceData.some(
        item => item.grnIndex === selectedItemDetails.grnIndex,
      );

      if (!itemExists) {
        setInvoiceData([
          ...invoiceData,
          {
            itemCode: selectedItemDetails.ItemCode,
            itemName: itemName,
            labelPrice: selectedItemDetails.SalePrice,
            itemDiscount: 0,
            unitPrice: selectedItemDetails.SalePrice,
            quantity: quantity,
            total: quantity * selectedItemDetails.SalePrice,
            grnIndex: selectedItemDetails.grnIndex,
          },
        ]);
      } else {
        showSnackbar(
          'Item with the same Grn Index already exists in the invoice.',
        );
      }
    } else {
      showSnackbar('Quantity cannot be greater than available quantity.');
    }
    setSelectedItemDetails(null);
  };

  const removeInvoiceDataById = (grnIndex: String) => {
    setInvoiceData(invoiceData.filter(item => item?.grnIndex !== grnIndex));
  };

  const clearInvoice = () => {
    handleResetAll();
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
          setShopAddress(i.address1 + ', ' + i.address2 + ', ' + i.address3);
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
            setItemName(i.label);
            setIsItemShopDrodown(false);
            filterItems(i.value);
            setSelectedItemDetails(null);
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
      <Text variant="labelSmall">{shop}</Text>
      <Text variant="labelSmall">{shopAddress}</Text>
      {filteredItemsList.length > 0 && item !== '' && (
        <ItemsTable data={filteredItemsList} getItemPrice={getItemPrice} />
      )}
      {selectedItemDetails !== null && (
        <View>
          <View style={styles.selectedItemContainer}>
            <View>
              <Text variant="labelMedium">Price ID</Text>
              <Text variant="labelSmall">{selectedItemDetails?.PriceId}</Text>
            </View>
            <View>
              <Text variant="labelMedium">Item Code</Text>
              <Text variant="labelSmall">{selectedItemDetails?.ItemCode}</Text>
            </View>
            <View>
              <Text variant="labelMedium">Grn_Index</Text>
              <Text variant="labelSmall">{selectedItemDetails?.grnIndex}</Text>
            </View>
            <View>
              <Text variant="labelMedium">Price</Text>
              <Text variant="labelSmall">{selectedItemDetails?.SalePrice}</Text>
            </View>
          </View>
          <View style={styles.addContainer}>
            <TouchableOpacity
              onPress={() => addToInvoice()}
              style={{
                backgroundColor: COMMON_COLORS.SUCCESS.W900,
                paddingHorizontal: 20,
                paddingVertical: 4,
                borderRadius: 5,
                marginLeft: 10,
              }}
              disabled={quantity <= 0}>
              <Icon source="plus" size={30} color={COMMON_COLORS.WHITE} />
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

      {item !== '' && (
        <Button
          icon={'undo-variant'}
          mode="contained"
          buttonColor={COMMON_COLORS.ERROR.W900}
          onPress={showDialog}
          style={styles.resetAllBtn}>
          Reset All
        </Button>
      )}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Do you want to reset all?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleResetAll}>Yes</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    color: COMMON_COLORS.GRAY.W600,
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
  resetAllBtn: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 8,
  },
});
