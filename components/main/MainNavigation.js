import React from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import Header from './Header'

const MainNavigation = ({setActiveView, toggleNav}) => {

    const options = [
        {
            text: "My Pantry",
            onPress: () => setActiveView(1)
        },
        {
            text: "My Recipes",
            onPress: () => setActiveView(2)
        },
        {
            text: "My Planner",
            onPress: () => setActiveView(3)
        },
        {
            text: "My Shopping List",
            onPress: () => setActiveView(4)
        },
    ]

    return (
        <ImageBackground source={require('../../assets/splash.png')} style={styles.container}>
            <Header toggleNav={toggleNav}/>
            <ScrollView style={styles.body}>
                {options.map((option, index) => {
                    if (index === 0) {
                        return (
                            <View key={option.text} style={styles.body.item}>
                                <Text style={styles.body.item.text} onPress={option.onPress}>{option.text}</Text>
                            </View>
                        )
                    }
                    else {
                        return (
                            <View key={option.text}>
                                <View style={styles.body.spacer} />
                                <View style={styles.body.item}>
                                    <Text style={styles.body.item.text} onPress={option.onPress}>{option.text}</Text>
                                </View>
                            </View>
                        )
                    }
                })}
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:"100%",
      height: "100%",
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    body: {
        flex: 0.85,
        width: "100%",
        item: {
            borderTopWidth: 5,
            borderTopStyle: "solid",
            borderTopColor: '#ffffff',
            borderBottomWidth: 5,
            borderBottomStyle: "solid",
            borderBottomColor: '#ffffff',
            height: 200,
            alignItems: "flex-end",
            justifyContent: "flex-end",
            text: {
                marginBottom: 20,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 15,
                paddingRight: 15,
                color: "#ffffff",
                fontSize: 20,
                backgroundColor: "#3B4548",
                borderTopWidth: 3,
                borderLeftWidth: 3,
                borderBottomWidth: 3,
                borderTopColor: '#ffffff',
                borderBottomColor: '#ffffff',
                borderLeftColor: '#ffffff',
                borderTopStyle: "solid",
                borderBottomStyle: "solid",
                borderBottomColor: '#ffffff',
            }
        },
        spacer: {
            height: 100,
            backgroundColor: "#000000",
        }
    }
})

export default MainNavigation