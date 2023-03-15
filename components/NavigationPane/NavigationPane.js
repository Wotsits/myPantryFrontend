import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Dimensions} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'


const NavigationPane = ({navOpen, toggleNav, setActiveView}) => {

    const options = [
        {
            text: "My Pantry",
            onPress: () => {
                setActiveView(1)
                toggleNav()
            }
        },
        {
            text: "My Recipes",
            onPress: () => {
                setActiveView(2)
                toggleNav()
            }
        },
        {
            text: "My Planner",
            onPress: () => {
                setActiveView(3)
                toggleNav()
            }
        },
        {
            text: "My Shopping List",
            onPress: () => {
                setActiveView(4)
                toggleNav()
            }
        },
    ]

    return (
        <View style={navOpen ? [styles.container, styles.containerOpen] : [styles.container, styles.containerClosed]} onDrag>
            <FontAwesome style={styles.button} name="times" size={40} color="white" onPress={toggleNav}/>
            {options.map(option => <Text key={option.text} style={styles.item} onPress={option.onPress}>{option.text}</Text>)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        height: Dimensions.get("window").height + 40,
        width: "75%", 
        backgroundColor: "#3B4548",   
        flex: 1,  
        padding: 40,
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
        color: "#ffffff",
        fontSize: 20
    },
    button: {
        position: "absolute",
        top: 55,
        right: 20,
    }
})

export default NavigationPane;