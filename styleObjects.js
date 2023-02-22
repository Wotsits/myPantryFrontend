/* 
    Central place for shared styles. 
*/

export const stylesColors = {
    mainBackground: "#000000",
    yellow: "#F7AD08",
    menuBackground: '#EEE8D7',
    textColorLight: '#FFFFFF',
    textColorDark: '#000000',
    positiveButtonGreen: "green",
    regativeButtonRed: "red"
}

export const stylesInputField = {
    borderWidth: 1,
    borderRadius: 8, 
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: stylesColors.textColorLight,
}

export const stylesFieldWithLabel = {
    width: "100%",
    marginBottom: 10,
    label: {
        marginBottom: 5,
        fontWeight: "bold"
    },
    field: stylesInputField
}

export const stylesWhiteText = {
    color: '#FFFFFF'
}
