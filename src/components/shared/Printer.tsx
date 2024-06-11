import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from 'react-native-thermal-receipt-printer';

interface IBLEPrinter {
  device_name: string;
  inner_mac_address: string;
}

const PrinterComponent = () => {
  const [printers, setPrinters] = useState<IBLEPrinter[]>([]);
  const [currentPrinter, setCurrentPrinter] = useState<IBLEPrinter | null>(
    null,
  );

  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  }, []);

  const _connectPrinter = (printer: IBLEPrinter) => {
    BLEPrinter.connectPrinter(printer.inner_mac_address)
      .then(() => setCurrentPrinter(printer))
      .catch(error => console.warn(error));
  };

  const printTextTest = () => {
    currentPrinter && BLEPrinter.printText('<C>sample text</C>\n');
  };

  const printBillTest = () => {
    currentPrinter && BLEPrinter.printBill('<C>sample bill</C>');
  };

  return (
    <View style={styles.container}>
      {printers.map(printer => (
        <TouchableOpacity
          key={printer.inner_mac_address}
          onPress={() => _connectPrinter(printer)}>
          <Text>
            {`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}
          </Text>
        </TouchableOpacity>
      ))}
      <Button
        mode="contained"
        onPress={printTextTest}
        style={{margin: 10, borderRadius: 8}}>
        Print Text
      </Button>
      <Button
        mode="contained"
        onPress={printBillTest}
        style={{margin: 10, borderRadius: 8}}>
        Print Bill Text
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrinterComponent;
