/* 
    Central place for shared styles. 
*/

export const stylesColors = {
    mainBackground: "#000000",
    yellow: "#F7AD08",
    menuBackground: '#EEE8D7',
    textColorLight: '#FFFFFF',
    borderColorLight: '#FFFFFF',
    textColorDark: '#000000',
    borderColorDark: '#000000',
    positiveButtonGreen: "green",
    regativeButtonRed: "red",
    negativeBackgroundRed: "#f7bcbc",
    positiveBackgroundGreen: "#b4f7b4",
    negativeBorderRed: "red",
    positiveBorderGreen: "green",
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
    flex: 1,
    marginBottom: 10,
    label: {
        marginBottom: 5,
        fontWeight: "bold"
    },
    field: stylesInputField,
    twoPartField: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        item: {
            flex: 0.5,
            marginRight: 10
        }
    }
}


export const stylesWhiteText = {
    color: '#FFFFFF'
}
