module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Optimize re-rendering
      'react-native-reanimated/plugin',
      
      // Enable fast refresh and reduce build time
      '@babel/plugin-transform-runtime',
      
      // Optimize imports
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './components',
            '@screens': './app',
            '@utils': './utils'
          }
        }
      ]
    ]
  };
};