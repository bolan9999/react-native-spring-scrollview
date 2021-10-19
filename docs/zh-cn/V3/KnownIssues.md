<!--
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-22 10:22:59
 * @LastEditTime: 2021-07-23 20:13:06
 * @LastEditors: 石破天惊
 * @Description: 
-->
# 已知问题
1. 由于React Native本身问题，安卓拥有`overflow:"scroll"`样式的View就不能直接支持borderRadius。你可以选择在外面套一层View即可实现borderRadius，就像下面这样：
```
<View style={{borderRadius:10,overflow:"hidden"}}>
    <SpringScrollView .../>
</View>
```
