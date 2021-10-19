<!--
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-22 10:22:59
 * @LastEditTime: 2021-07-23 23:22:13
 * @LastEditors: 石破天惊
 * @Description: 
-->
# 滑动

要使用代码滑动到指定位置，非常简单：

### 第一步，获取SpringScrollView的引用
```$js
<SpringScrollView ref={ref=>(this._scrollView = ref)} />
```

### 第二步，使用scrollTo方法
```$js
this._scrollView && this._scrollView.scrollTo({x:0,y:100}).then().catch();
```
### 可用滑动方法
scrollTo({x:number, y:number}, animated:boolean=true):Promise&lt;void>

滑动到指定的偏移

scroll({x:number, y:number}, animated:boolean=true):Promise&lt;void>

在当前位置上滑动指定的偏移，请注意scroll参数是偏移值，scrollTo是目标值

scrollToBegin(animated:boolean=true):Promise&lt;void>

滑动到垂直方向顶部，水平方向不变。

scrollToEnd(animated: boolean = true):Promise&lt;void>

滑动到垂直方向底部，水平方向不变。


# Javascript端监听滑动

### onScroll : ({nativeEvent:{contentOffset:{x:number, y:number}}})=>any

```$js
<SpringScrollView onScroll={({nativeEvent:{contentOffset:{x, y}}})=>{
    console.log("offset : x=", x, "y=", y);
}/>
```

注意：

* x,y值都是有可能超出内容范围之外的
* `onScroll`修改为和官方一致，`SpringScrollView`支持`Animated.createAnimatedComponent`，并且`onScroll`支持`react-native-reanimated`

# 监听原生偏移值

### onNativeContentOffsetExtract ：{x?&#58;Animated.Value, y?&#58;Animated.Value}

使用原生动画值监听滑动偏移，可以用作插值动画
下面是一个简单的吸住SpringScrollView的示例
```$js
_nativeOffset = {
    y: new Animated.Value(0)
};

render(){
    return <SpringScrollView onNativeContentOffsetExtract={this._nativeOffset}>
        <Animated.View style={{transform: [{ translateY: this._nativeOffset.y }]}}/>
    </SpringScrollView>
}

```






