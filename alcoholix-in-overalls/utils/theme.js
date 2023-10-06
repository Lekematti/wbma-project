const styling = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: Colors[theme]?.themeColor,
      paddingHorizontal: 20,
    },
    textStyle: {
      color: Colors[theme]?.white,
    },
    textInputStyle: {
      borderColor: Colors[theme]?.gray,
      padding: 10,
      borderWidth: 2,
      borderRadius: 5,
      width: '100%',
      marginTop: 20,
      color: Colors[theme]?.white,
    },
    touchableStyle: {
      backgroundColor: Colors[theme]?.sky,
      padding: 10,
      borderRadius: 6,
      width: '100%',
      height: 57,
      justifyContent: 'center',
      marginTop: 20,
    },
    buttonTextStyle: {
      textAlign: 'center',
      color: Colors[theme]?.commonWhite,
      fontSize: 20,
      fontWeight: '500',
    },
  });




const Colors = () =>  {
  const commonColor = {
    commonWhite: '#FFFFFF',
    commonBlack: '#000000',
    activeColor: '#DE5E69',
    deactiveColor: '#DE5E6950',
    boxActiveColor: '#DE5E6940',
  };

  const light = {
    themeColor: '#FFFFFF',
    white: '#000000',
    sky: '#DE5E69',
    gray: 'gray',
    ...commonColor,
  };

  const dark = {
    themeColor: '#000000',
    white: '#FFFFFF',
    sky: '#831a23',
    gray: 'white',
    ...commonColor,
  };
}


export default { light, dark, styling };
