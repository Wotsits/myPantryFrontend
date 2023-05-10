import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { UserContext } from '../../contexts/UserContext';
import { stylesColors } from '../../styleObjects';


const Header = ({setActiveView, viewName, toggleNav}) => {
    
    // ---------------------
    // Context
    // ---------------------

    const {logOut} = React.useContext(UserContext);

    // ---------------------
    // Event handlers
    // ---------------------

    /**
     * @description A function which handles logging out a user
     * @returns void
     */
    function handleLogOut() {
        logOut('secure_token')
    }

    // ---------------------
    // Render
    // ---------------------

    return (
        <View style={styles.header}>
            <FontAwesome style={styles.header.headerItem} name='bars' size={32} onPress={toggleNav}/>
            {viewName && <Text style={styles.header.viewName} onPress={setActiveView}>{viewName}</Text>}
            {!viewName && <Image source={require('../../assets/logo.png')} style={styles.header.logo} onPress={() => setActiveView(0)}/>}
            <FontAwesome style={styles.header.headerItem} name='sign-out-alt' size={32} onPress={() => handleLogOut()}/>
        </View>
    )
}

// ---------------------
// Style Definitions
// ---------------------

const styles = StyleSheet.create({
    header: {
        flex: 0.2,
        flexDirection: "row",
        width: "100%",
        backgroundColor: stylesColors.mainBackground,
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
            color: stylesColors.textColorLight,
            fontSize: 20
        },
        headerItem: {
            color: stylesColors.textColorLight
        }
    }
})

export default Header;