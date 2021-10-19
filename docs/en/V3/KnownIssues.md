<!--
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-23 23:43:47
 * @LastEditTime: 2021-07-24 00:25:30
 * @LastEditors: 石破天惊
 * @Description: 
-->
# Known issues
1. Due to the RN bug, all views with `overflow:scroll` on Android can not support borderRadius, but you can set a wrapper for it like this:

```
<View style={{borderRadius:10,overflow:"hidden"}}>
    <SpringScrollView .../>
</View>
```