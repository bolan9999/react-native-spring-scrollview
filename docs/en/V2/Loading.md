# Loading

### Preview
![Preview](../../res/LoadingStickyContent.gif)

### Code

Import

```$js
import { SpringScrollView } from "react-native-spring-scrollview";
import { NormalFooter } from "react-native-spring-scrollview/NormalFooter";
```

It is easy to support loading more data with SpringScrollView. This library offers a `NormalFooter` for you. And you can try other loading footers in the [Customize](https://github.com/bolan9999/react-native-spring-scrollview/tree/master/src/Customize) dir.

```$js
<SpringScrollView
  ref={ref => (this._scrollView = ref)}
  loadingFooter={NormalFooter}
  allLoaded={this.state.allLoaded}
  onLoading={()=>{
    setTimeOut(()=>{
      this._scrollView.endLoading();
      this.setState({...});
    },2000);
  }>
    <Text key={item} style={styles.text}>
      This is a Normal Loading Test
    </Text>
</SpringScrollView>
```


### Props

Props  |  Type  |  Default  |  Description  
---- | ------ | --------- | --------
onLoading | ()=>any | undefined | The callback of loading. If set this prop, a loading footer will add to the botom of the SpringScrollView
allLoaded | boolean | false | Whether the data is all loaded.
loadingFooter | LoadingFooter | NormalFooter | The footer component of loading. If you want to customize loading footer , this will be helpful [Custom Loading](/en/V2/CustomLoading)



### All loading footers in this library

```
import {NormalFooter} from "react-native-spring-scrollview/NormalFooter";
import {
    WithLastDateFooter,
    ChineseNormalFooter,
    ChineseWithLastDateFooter,
} from "react-native-spring-scrollview/Customize";
```
