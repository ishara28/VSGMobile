import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Text, TextInput} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import axios from 'axios';
import {REPS_LIST_ENDPOINT} from '../../../constants/urls';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {
  isLoggedInAtom,
  repIdAtom,
  spinnerVisibleAtom,
} from '../../../recoil/atoms';
import {
  checkRepIdExists,
  connectToDatabase,
  createSalesRepsTable,
  insertSalesReps,
} from '../../../services/db-service';
import {useNavigation} from '@react-navigation/native';
import {useSnackbar} from '../../common/SnackbarContext';

const Login = () => {
  const navigation = useNavigation();
  const {showSnackbar} = useSnackbar();

  const [repName, setRepName] = useState('');
  const setSpinnerVisible = useSetRecoilState(spinnerVisibleAtom);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [repId, setRepId] = useRecoilState(repIdAtom);

  const syncReps = async () => {
    setSpinnerVisible(true);
    const result = await axios.get(REPS_LIST_ENDPOINT);
    const db = await connectToDatabase();
    await createSalesRepsTable(db);
    await insertSalesReps(db, result.data);
    setSpinnerVisible(false);
  };

  const handleLogin = async () => {
    setSpinnerVisible(true);
    const db = await connectToDatabase();
    const isRepExists = await checkRepIdExists(db, repName);
    if (isRepExists) {
      setRepId(repName);
      showSnackbar('Successfully Logged In');
      setIsLoggedIn(true);
    } else {
      showSnackbar('Rep does not exist');
      setIsLoggedIn(false);
    }
    setSpinnerVisible(false);
  };

  const handleNavigation = () => {
    if (isLoggedIn) {
      navigation.reset({index: 0, routes: [{name: 'Home'}]});
    }
  };

  useEffect(() => {
    handleNavigation();
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">VSG - User Login</Text>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />
      <View style={styles.formView}>
        <TextInput
          label="Rep Name"
          style={styles.textInput}
          value={repName}
          onChangeText={setRepName}
          underlineColor="transparent"
          underlineStyle={{borderWidth: 0}}
        />
        <Button
          style={[styles.button, styles.loginButton]}
          mode="contained"
          icon={'login'}
          onPress={() => handleLogin()}>
          Login
        </Button>
        <Button
          style={[styles.button, styles.syncButton]}
          mode="contained"
          icon={'sync'}
          onPress={() => syncReps()}>
          Sync Account
        </Button>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  formView: {paddingHorizontal: 20, width: '100%', marginTop: 20},
  textInput: {width: '100%', marginBottom: 10, borderRadius: 8},
  button: {
    margin: 5,
    borderRadius: 8,
    width: '100%',
  },
  loginButton: {
    backgroundColor: COMMON_COLORS.BLACK,
  },
  syncButton: {
    backgroundColor: COMMON_COLORS.ERROR.W900,
  },
});