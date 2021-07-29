<!--
 * @Author: 石破天惊
 * @email: shanshang130@gmail.com
 * @Date: 2021-07-23 23:43:47
 * @LastEditTime: 2021-07-29 23:42:11
 * @LastEditors: 石破天惊
 * @Description: 
-->
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
dragToHideKeyboard | boolean | true | dragToHideKeyboard
onSizeChange | ({width:number,height:number})=>any | undefined | The callback when the wrapper view size changed.
onContentSizeChange | ({width:number,height:number})=>any | undefined | The callback when the content view size changed.
inverted | boolean | false | inverted. It is a service for LargeList.
pagingEnabled | boolean | false | When true, the scroll view stops on multiples of `pageSize` when scrolling. This can be used for pagination on both horizontal and vertical directions.
decelerationRate | number | 0.997 | decelerationRate
pageSize | {width:number, height:number} | {width:0,height:0} | Works only when `pagingEnabled=true`, the scroll view stops on multiples of `pageSize` when scrolling. This can be used for pagination on both horizontal and vertical directions。If the width or height set to 0, it will equal to the view port of the SpringScrollView's width or height.
