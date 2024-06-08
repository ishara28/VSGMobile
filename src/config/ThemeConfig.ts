import {ThemeProp} from 'react-native-paper/lib/typescript/types';
import {DefaultTheme} from 'react-native-paper';
import {FONTS} from '../resources/fonts';
import {DARK_THEME_COLORS, LIGHT_THEME_COLORS} from '../resources/colors';

const CustomTheme: ThemeProp = {
  ...DefaultTheme,
  colors: LIGHT_THEME_COLORS.colors,
  // colors: DARK_THEME_COLORS.colors,
  fonts: {
    displaySmall: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 36,
      // fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 44,
    },
    displayMedium: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 45,
      // fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 52,
    },
    displayLarge: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 57,
      // fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 64,
    },
    headlineSmall: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 24,
      // fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 32,
    },

    headlineMedium: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 28,
      // fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 36,
    },

    headlineLarge: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 32,
      // fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 40,
    },
    titleSmall: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 14,
      //   fontWeight: '500',
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    titleMedium: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 16,
      //   fontWeight: '500',
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    titleLarge: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 22,
      // fontWeight: '400',
      letterSpacing: 0,
      lineHeight: 28,
    },
    labelSmall: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 11,
      //   fontWeight: '500',
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelMedium: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 12,
      //   fontWeight: '500',
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelLarge: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 14,
      //   fontWeight: '500',
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 12,
      // fontWeight: '400',
      letterSpacing: 0.4,
      lineHeight: 16,
    },
    bodyMedium: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 14,
      // fontWeight: '400',
      letterSpacing: 0.25,
      lineHeight: 20,
    },
    bodyLarge: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 16,
      // fontWeight: '400',
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    default: {
      fontFamily: FONTS.POPPINS_MEDIUM,
      letterSpacing: 0,
    },
  },
};

export default CustomTheme;
