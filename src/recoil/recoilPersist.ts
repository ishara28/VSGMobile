import AsyncStorage from '@react-native-async-storage/async-storage';
import {AtomEffect, atom} from 'recoil';

const persistAtom =
  <T>(key: string): AtomEffect<T> =>
  ({setSelf, onSet}) => {
    const loadPersisted = async () => {
      const savedValue = await AsyncStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }
    };

    loadPersisted();

    onSet(newValue => {
      AsyncStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const persistentAtom = <T>(options: Parameters<typeof atom>[0]) => {
  return atom<T>({
    ...options,
    effects_UNSTABLE: [persistAtom<T>(options.key)],
  });
};
