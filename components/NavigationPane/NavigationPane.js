import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { stylesColors } from '../../styleObjects';


const NavigationPane = ({navOpen, toggleNav, setActiveView}) => {

    // options for the navigation menu.
    const options = [
        {
            text: "My Pantry",
            onPress: () => {
                setActiveView(1)
                toggleNav()
            },
            icon: "box-open"
        },
        {
            text: "My Recipes",
            onPress: () => {
                setActiveView(2)
                toggleNav()
            },
            icon: "book-open"
        },
        {
            text: "My Shopping List",
            onPress: () => {
                setActiveView(4)
                toggleNav()
            },
            icon: "clipboard-list"
        },
    ]

    // ---------------------
    // Render
    // ---------------------

    return (
        <View style={navOpen ? [styles.container, styles.containerOpen] : [styles.container, styles.containerClosed]} onDrag>
            <FontAwesome style={styles.button} name="times" size={40} color="white" onPress={toggleNav}/>
            {/* Map over the options and render to menu */}
            {options.map(option => (
                <Text key={option.text} style={styles.item} onPress={option.onPress}>
                    <FontAwesome name={option.icon} color="white" size={20}/> - {option.text}
                </Text>))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        // the +40 accounts for the padding below
        height: Dimensions.get("window").height + 40,
        width: "75%", 
        backgroundColor: stylesColors.navBackground,   
        flex: 1,  
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 20,
        paddingRight: 20,
        display : "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    containerOpen: {
        left: 0,
    },
    containerClosed: {
        left: -Dimensions.get("window").width   
    },
    item: {
        color: stylesColors.textColorLight,
        fontSize: 20
    },
    button: {
        position: "absolute",
        top: 55,
        right: 20,
    }
})

export default NavigationPane;