// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const withStorybook = require('@storybook/react-native/metro/withStorybook'); 

module.exports = withStorybook(withNativeWind(config, { input: './src/app/global.css' }));
