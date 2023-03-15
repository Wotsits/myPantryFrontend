import React from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import Header from '../main/Header'

const Planner = ({setActiveView, toggleNav}) => {
    return (
        <View style={styles.container}>
            <Header viewName={"My Planner"} setActiveView={() => setActiveView(0)} toggleNav={toggleNav}/>
            <Text>My Planner</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:"100%",
      height: "100%",
      alignItems: 'center',
      justifyContent: 'flex-start',
    }
})

export default Planner;