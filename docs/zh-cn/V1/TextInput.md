# 处理键盘遮挡

移动APP经常会遇到一个尴尬的问题，输入框的键盘遮挡问题。不用担心，使用VerticalScrollView能够很轻松的处理键盘遮挡问题。

### 第一步：创建ReactRef引用
```$js
_ref = React.createRef();
```

### 第二步：让ref指向TextInput
```$js
<TextInput ref={[this._ref]}
```

### 第三步：让VerticalScrollView处理键盘遮挡
```$js
<VerticalScrollView textInputRefs={[this._ref]}
```

### 示例

```$js
export class InputExample extends React.Component {
  _topInput = React.createRef();
  _bottomInput = React.createRef();

  render() {
   return (
      <VerticalScrollView
        style={{flex:1}}
        textInputRefs={[this._topInput, this._bottomInput]}
      >
        <TextInput ref={this._topInput} />
        ...//Other content
        <TextInput ref={this._bottomInput} />
      </VerticalScrollView>
    );
  }
}
```

具体参见[InputExample](https://github.com/bolan9999/react-native-spring-scrollview/blob/master/Examples/InputExample.js)


### 属性

#### textInputRefs

类型：TextInput[]

默认值：[]

描述：将TextInput的引用传入，让VerticalScrollView自动管理键盘遮挡问题。

#### tapToHideKeyboard

类型：boolean

默认值：true

描述：触摸屏幕时是否隐藏键盘

#### inputToolBarHeight

类型：number

默认值：44

描述：不同的系统，不同的三方输入法，键盘的工具栏高度是不确定的，并且官方没有给出获取工具栏高度的办法，这个属性用以给用户小幅调整键盘弹起时，组件偏移的位置



