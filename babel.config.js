module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        alias: {
          '@api': './src/api',
          '@app': './src/app',
          '@components': './src/components',
          '@model': './src/model',
          '@screens': './src/screens',
          '@store': './src/store',
          '@ui': './src/ui',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
