# 处理键盘遮挡

移动APP经常会遇到一个尴尬的问题，输入框的键盘遮挡问题。不用担心，使用SpringScrollView能够很轻松的处理键盘遮挡问题。

### 第一步：创建ReactRef引用
```$js
_ref = React.createRef();
```

### 第二步：让ref指向TextInput
```$js
<TextInput ref={this._ref}
```

### 第三步：让SpringScrollView处理键盘遮挡
```$js
<SpringScrollView textInputRefs={[this._ref]}
```

属性  |  类型  |  默认值  |  作用  
---- | ------ | --------- | --------
textInputRefs | TextInput[] | [] | 将TextInput的引用传入，让SpringScrollView自动管理键盘遮挡问题。
tapToHideKeyboard | boolean | true | 触摸屏幕时是否隐藏键盘
inputToolBarHeight | number | 44 | 不同的系统，不同的三方输入法，键盘的工具栏高度是不确定的，并且官方没有给出获取工具栏高度的办法，这个属性用以给用户小幅调整键盘弹起时，组件偏移的位置

### 示例

```$js
export class InputExample extends React.Component {
  _topInput = React.createRef();
  _bottomInput = React.createRef();

  render() {
   return (
      <SpringScrollView
        textInputRefs={[this._topInput, this._bottomInput]}
        tapToHideKeyboard
        inputToolBarHeight={60}
      >
        <TextInput ref={this._topInput} />
        ...//Other content
        <TextInput ref={this._bottomInput} />
      </SpringScrollView>
    );
  }
}
```

具体参见[InputExample](https://github.com/bolan9999/react-native-spring-scrollview/blob/master/Examples/InputExample.js)



