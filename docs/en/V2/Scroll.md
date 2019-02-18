# Scroll to

It is easy to scrollTo:

### Firstly，get the reference of the SpringScrollView:
```$js
<SpringScrollView ref={ref=>(this._scrollView = ref)} />
```

### Secondly, call `scrollTo`
```$js
this._scrollView && this._scrollView.scrollTo({x:0,y:100}).then().catch();
```
### Available scrolling methods
scrollTo({x:number, y:number}, animated:boolean=true):Promise&lt;void>

scroll({x:number, y:number}, animated:boolean=true):Promise&lt;void>

scrollToBegin(animated:boolean=true):Promise&lt;void>

scrollToEnd(animated: boolean = true):Promise&lt;void>

# onScroll listener on Javascript

### onScroll : ({nativeEvent:{contentOffset:{x:number, y:number}}})=>any

```$js
<SpringScrollView onScroll={({nativeEvent:{contentOffset:{x, y}}})=>{
    console.log("offset : x=", x, "y=", y);
}/>
```

**Precautions：**

* The `contentOffset` can be able to out of content view range.
* Do not use `Animated.createAnimatedComponent`，SpringScrollView support all Animated.View styles, if you want  to make a native interpolate animation, use `onNativeContentOffsetExtract` please.

# Native onScroll listener

### onNativeContentOffsetExtract : {x?&#58;Animated.Value, y?&#58;Animated.Value}

This is a sticky view example:
```$js
_nativeOffset = {
    y: new Animated.Value(0)
};

render(){
    return <SpringScrollView onNativeContentOffsetExtract={this._nativeOffset}>
        <Animated.View style={transform: [{ translateY: this._nativeOffset.y }]}/>
    </SpringScrollView>
}

```






