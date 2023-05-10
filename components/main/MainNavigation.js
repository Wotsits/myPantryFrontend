import React from 'react';
import {View, StyleSheet, ImageBackground, ScrollView, Text} from 'react-native'
import Header from './Header'
import { stylesColors } from '../../styleObjects';

const MainNavigation = ({setActiveView, toggleNav}) => {

    // options for the navigation menu.
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
            text: "My Shopping List",
            onPress: () => setActiveView(4)
        },
    ]

    // ---------------------
    // Render
    // ---------------------

    return (
        <ImageBackground source={require('../../assets/splash.png')} style={styles.container}>
            <Header toggleNav={toggleNav}/>
            <ScrollView style={styles.body}>
                {/* map over the options and render item for each. */}
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

// ---------------------
// Style Definitions
// ---------------------

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
            borderTopColor: stylesColors.borderColorLight,
            borderBottomWidth: 5,
            borderBottomStyle: "solid",
            borderBottomColor: stylesColors.borderColorLight,
            height: 200,
            alignItems: "flex-end",
            justifyContent: "flex-end",
            text: {
                marginBottom: 20,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 15,
                paddingRight: 15,
                color: stylesColors.textColorLight,
                fontSize: 20,
                backgroundColor: stylesColors.navBackground,
                borderTopWidth: 3,
                borderLeftWidth: 3,
                borderBottomWidth: 3,
                borderTopColor: stylesColors.borderColorLight,
                borderBottomColor: stylesColors.borderColorLight,
                borderLeftColor: stylesColors.borderColorLight,
                borderTopStyle: "solid",
                borderBottomStyle: "solid",
                borderBottomColor: stylesColors.borderColorLight,
            }
        },
        spacer: {
            height: 100,
            backgroundColor: stylesColors.mainBackground,
        }
    }
})

export default MainNavigation