/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#4cc9f0';
const faceColorLight = '#687076';
const faceColorDark = '#e9ecef';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: faceColorLight,
    tabIconDefault: faceColorLight,
    tabIconSelected: tintColorLight,
    face: faceColorLight,
    border: '#e9ecef',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: faceColorDark,
    tabIconDefault: faceColorDark,
    tabIconSelected: tintColorDark,
    face: faceColorDark,
    border: '#2c3e50',
  },
};
