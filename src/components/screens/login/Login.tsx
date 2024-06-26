import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Text, TextInput} from 'react-native-paper';
import {COMMON_COLORS} from '../../../resources/colors';
import axios from 'axios';
import {REPS_LIST_ENDPOINT} from '../../../constants/urls';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {
  isLoggedInAtom,
  loggedUserAtom,
  repIdAtom,
  spinnerVisibleAtom,
} from '../../../recoil/atoms';
import {
  checkRepIdExists,
  connectToDatabase,
  createSalesRepsTable,
  getUserByRepName,
  insertSalesReps,
} from '../../../services/db-service';
import {useNavigation} from '@react-navigation/native';
import {useSnackbar} from '../../common/SnackbarContext';

const Login = () => {
  const navigation = useNavigation();
  const {showSnackbar} = useSnackbar();

  const [repName, setRepName] = useState('');
  const [password, setPassword] = useState('');
  const setSpinnerVisible = useSetRecoilState(spinnerVisibleAtom);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [repId, setRepId] = useRecoilState(repIdAtom);
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom);

  const syncReps = async () => {
    setSpinnerVisible(true);
    const result = await axios.get(REPS_LIST_ENDPOINT);
    const db = await connectToDatabase();
    await createSalesRepsTable(db);
    await insertSalesReps(db, result.data);
    setSpinnerVisible(false);
    showSnackbar('Reps Synced Successfully');
  };

  const handleLogin = async () => {
    setSpinnerVisible(true);
    const db = await connectToDatabase();
    const user: any = await getUserByRepName(db, repName, password);
    console.log(user);
    if (user) {
      setRepId(user.RepId);
      setLoggedUser(user);
      showSnackbar('Successfully Logged In');
      setIsLoggedIn(true);
    } else {
      showSnackbar('Invalid Login!');
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
          label="Rep Id"
          style={styles.textInput}
          value={repName}
          onChangeText={setRepName}
          underlineColor="transparent"
          underlineStyle={{borderWidth: 0}}
        />
        <TextInput
          label="Password"
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
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
  textInput: {width: '100%', marginBottom: 10, borderRadius: 4},
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
