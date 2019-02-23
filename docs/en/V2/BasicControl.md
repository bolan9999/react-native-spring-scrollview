# Basic Props


Props  |  Type  |  Default  |  description  
---- | ------ | --------- | --------
...ViewProps | - | | All props of [View](http://facebook.github.io/react-native/docs/view)
bounces | boolean | true | Bounces if the content offset is out of the content view. It won't be bounces on the horizontal direction if the content view is not wider than the wrapper view although bounces is true. But it will on the vertical direction.
contentStyle | ViewStyle | undefined | The style of the content view.
scrollEnabled | boolean | true | scrollEnabled
directionalLockEnabled | boolean | false | When true, the SpringScrollView will try to lock to only vertical or horizontal scrolling while dragging.
initialContentOffset | {x:number, y:number} | undefined | initial content offset. Only works when initiation.
showsVerticalScrollIndicator | boolean | true | showsVerticalScrollIndicator
showsHorizontalScrollIndicator | boolean | true | showsHorizontalScrollIndicator
tapToHideKeyboard | boolean | true | tapToHideKeyboard
onSizeChange | ({width:number,height:number})=>any | undefined | The callback when the wrapper view size changed.
onContentSizeChange | ({width:number,height:number})=>any | undefined | The callback when the content view size changed.
inverted | boolean | false | inverted. It is a service for LargeList.

