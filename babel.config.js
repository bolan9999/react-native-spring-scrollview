/*
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 1985-10-26 16:15:00
 * @LastEditTime: 2021-09-24 09:45:40
 * @LastEditors: 石破天惊
 * @Description:
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
