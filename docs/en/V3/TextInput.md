# Keyboard avoiding

### Firstly：create a reference
```$js
_ref = React.createRef();
```

### Secondly：assign to ref
```$js
<TextInput ref={this._ref}
```

### Lastly
```$js
<SpringScrollView textInputRefs={[this._ref]}
```

Props  |  Type  |  Default  |  description  
---- | ------ | --------- | --------
textInputRefs | TextInput[] | [] | put all TextInput components into this prop.And then  It can automatically adjust either its position or bottom padding based on the position of the keyboard.
tapToHideKeyboard | boolean | true | tapToHideKeyboard
inputToolBarHeight | number | 44 | inputToolBarHeight

### Example

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

Full example is here [InputExample](https://github.com/bolan9999/react-native-spring-scrollview/blob/master/Examples/InputExample.js)



