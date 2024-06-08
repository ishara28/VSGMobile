import {atom} from 'recoil';
import {persistentAtom} from './recoilPersist';

export const spinnerVisibleAtom = atom({
  key: 'spinnerVisibleAtom',
  default: false,
});

export const isLoggedInAtom = persistentAtom<boolean>({
  key: 'isLoggedInAtom',
  default: false,
});

export const repIdAtom = persistentAtom<String>({
  key: 'repIdAtom',
  default: '',
});
