### Overview

SpringScrollView is a high performance cross-platform  native bounces ScrollView for React Native.(iOS & Android). It is same as the ScrollView from React-Native, SpringScrollView simply renders all its react child components at once. That makes it very easy to understand and use. If you need a high-performance reused large list component , maybe [LargeList](https://bolan9999.github.io/react-native-largelist/#/) is a good choice.

Keep in mind that SpringScrollViews must have a bounded height in order to work, since they contain unbounded-height children into a bounded container (via a scroll interaction). In order to bound the height of a ScrollView, either set the height of the view directly (discouraged) or make sure all parent views have bounded height. SpringScrollViews default have a `{flex:1}` style, please be sure its parent has abounded height.

### style & contentStyle

As the ScrollView in React-Native, SpringScrollView consists of a wrapper and a content view. The `style` configure the wrapper's style and the `contentStyle` configure the content view's style. The style prop has a `{flex:1}` and the `contentStyle` has a `{flexDirection:"column",justifyContent:"stretch"}` default property. It is different from the official ScrollView. And you can override them. Note that `contentStyle` should not contain a `transform` props.

Props  |  Type  |  Default  |  description  
---- | ------ | --------- | --------
style | Animated.[ViewStyle](http://facebook.github.io/react-native/docs/view-style-props) | {flex:1} | The wrapper style of the SpringScrollView. It supports Animated style.
contentStyle | [ViewStyle](http://facebook.github.io/react-native/docs/view-style-props) | - | The content view style of the SpringScrollView.

**Precautions：** SpringScrollViews support both horizontal and vertical directions scroll after Version 2 . If the content view is wider than the wrapper, horizontal scroll and bounces will be enabled. ContentStyle supports `{width:"200%"}` or `width:1000` style and so on.
