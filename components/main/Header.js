import React from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'


const Header = ({setActiveView, viewName}) => {
    return (
        <View style={styles.header}>
            <FontAwesome style={styles.header.headerItem} name='bars' size={32}/>
            {viewName && <Text style={styles.header.viewName} onPress={setActiveView}>{viewName}</Text>}
            {!viewName && <Image source={require('../../assets/logo.png')} style={styles.header.logo} onPress={() => setActiveView(0)}/>}
            <FontAwesome style={styles.header.headerItem} name='cog' size={32}/>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 0.2,
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#000000",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        logo: {
            width: 100,
            height: 100
        },
        viewName: {
            color: '#ffffff',
            fontSize: 20
        },
        headerItem: {
            color: '#ffffff'
        }
    }
})

export default Header;