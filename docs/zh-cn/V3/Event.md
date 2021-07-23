<!--
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-22 10:22:58
 * @LastEditTime: 2021-07-23 23:26:55
 * @LastEditors: 石破天惊
 * @Description: 
-->
### onTouchBegin : ()=>any
手指按下时回调
```$js
<SpringScrollView onTouchBegin={()=>{
    console.log("onTouchBegin");
} />
```

### onTouchEnd : ()=>any
手指抬起时回调
```$js
<SpringScrollView onTouchEnd={()=>{
    console.log("onTouchEnd");
} />
```

### onScrollBeginDrag : ()=>any
开始拖拽时的回调函数，注意这与onTouchBegin有区别，onTouchBegin无论是否发生拖拽都会触发
```$js
<SpringScrollView onScrollBeginDrag={()=>{
    console.log("onScrollBeginDrag");
} />
```

### onScrollEndDrag : ()=>any
开始拖拽时的回调函数，注意这与onTouchEnd有区别，onTouchEnd无论是否发生拖拽都会触发
```$js
<SpringScrollView onScrollEndDrag={()=>{
    console.log("onScrollEndDrag");
} />
```

### onMomentumScrollBegin : ()=>any
松手后减速开始的回调
```$js
<SpringScrollView onMomentumScrollBegin={()=>{
    console.log("onMomentumScrollBegin");
} />
```

### onMomentumScrollEnd : ()=>any
减速结束回调
```$js
<SpringScrollView onMomentumScrollEnd={()=>{
    console.log("onMomentumScrollEnd");
} />
```
