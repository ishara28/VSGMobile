import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {PaperProvider} from 'react-native-paper';
import CustomTheme from './src/config/ThemeConfig';
import Navigator from './src/navigation/Navigator';
import VSpinner from './src/components/common/VSpinner';
import {useRecoilValue} from 'recoil';
import {spinnerVisibleAtom} from './src/recoil/atoms';
import {SnackbarProvider} from './src/components/common/SnackbarContext';

const App = () => {
  const spinnerVisible = useRecoilValue(spinnerVisibleAtom);
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
