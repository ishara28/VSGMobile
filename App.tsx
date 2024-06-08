import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import React, {useEffect} from 'react';
import {PaperProvider} from 'react-native-paper';
import CustomTheme from './src/config/ThemeConfig';
import Navigator from './src/navigation/Navigator';
import VSpinner from './src/components/common/VSpinner';
import {useRecoilValue} from 'recoil';
import {spinnerVisibleAtom} from './src/recoil/atoms';
import {SnackbarProvider} from './src/components/common/SnackbarContext';

const App = () => {
  const spinnerVisible = useRecoilValue(spinnerVisibleAtom);

  useEffect(() => {
    requestBluetoothPermission();
  }, []);

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]);
        if (
          granted['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Bluetooth permissions granted');
        } else {
          console.log('Bluetooth permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  return (
    <PaperProvider theme={CustomTheme}>
      <SnackbarProvider>
        <SafeAreaView style={{flex: 1}}>
          <VSpinner visible={spinnerVisible} />
          <Navigator />
        </SafeAreaView>
      </SnackbarProvider>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
