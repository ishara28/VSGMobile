import React, {createContext, useContext, useState, useCallback} from 'react';
import {Snackbar, Text} from 'react-native-paper';
import {COMMON_COLORS} from '../../resources/colors';

const SnackbarContext = createContext(null);

export const SnackbarProvider = ({children}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = useCallback(msg => {
    setMessage(msg);
    setVisible(true);
  }, []);

  const hideSnackbar = () => {
    setVisible(false);
  };

  return (
    <SnackbarContext.Provider value={{showSnackbar}}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        action={{
          label: 'Close',
          onPress: hideSnackbar,
        }}>
        <Text variant="labelSmall" style={{color: COMMON_COLORS.WHITE}}>
          {message}
        </Text>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
