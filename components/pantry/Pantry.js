import React, { startTransition, useEffect, useState, useContext } from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Dimensions, ToastAndroid} from 'react-native'
import Header from '../main/Header'
import PantryItemList from './PantryItemList'
import { UserContext } from '../../contexts/UserContext';
import SlidingMenu from '../slidingMenu/slidingMenu';
import {api} from '../../settings'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { stylesColors } from '../../styleObjects';
import FloatingButton from '../FloatingButton/FloatingButton';

const Pantry = ({setActiveView, toggleNav}) => {
    
    // ---------------------
    // Context
    // ---------------------

    const {token} = useContext(UserContext)
    
    // ---------------------
    // State Declarations
    // ---------------------

    const [categories, setCategories] = useState([])
    const [itemOpenInMenu, setItemOpenInMenu] = useState("")
    const [menuStageOpen, setMenuStageOpen] = useState("MENU")
    const [readyForRender, setReadyForRender] = useState(false)

    // ---------------------
    // UseEffects
    // ---------------------

    // on first render, get the pantry item categories.
    useEffect(() => {
        fetch(`${api}api/pantryItemCategories/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(data => {
            // set the state to the obtained pantry item categories.
            setCategories(data)
            setReadyForRender(true)
        })
        .catch((error) => {
            ToastAndroid.show('Failed to retrieve Pantry Item Categories', ToastAndroid.ERROR)
            console.error(error)
        })
    }, [])

    // ---------------------
    // Render
    // ---------------------

    if (!readyForRender) return <View style={styles.container}><Text style={{width: "100%", textAlign: "center", color: stylesColors.textColorLight}}>Loading...</Text></View>
    return (
        <View style={styles.container}>
            {/* The header */}
            <Header viewName={"My Pantry"} setActiveView={() => setActiveView(0)} toggleNav={toggleNav}/>
            
            {/* The content */}
            <ScrollView style={styles.container.body}>
                {/* Map over the categories and create a category heading and render the pantryItemList beneath */}
                {categories.map(category => (
                    <View key={category.id} style={styles.container.body.category}>
                        <View style={styles.container.body.category.headingContainer}>
                            <FontAwesome style={styles.container.body.category.headingContainer.heading} name={category.icon}/>
                            <Text style={styles.container.body.category.headingContainer.heading}>{category.name}</Text>
                        </View>
                        <PantryItemList categoryId={category.id} itemOpenInMenu={itemOpenInMenu} setItemOpenInMenu={setItemOpenInMenu}/>
                    </View>))}
            </ScrollView>

            {/* The flaoting add button */}
            <FloatingButton onPress={() => {
                    setItemOpenInMenu("0")
                    setMenuStageOpen("NEW")
                }}
            />

            {/* The sliding menu */}
            {itemOpenInMenu && (
                <SlidingMenu 
                    buttons={[
                        {icon: 'pencil-alt', text: "Edit Pantry Item", color: "black", onPress: () => setMenuStageOpen("EDIT")},
                        {icon: 'trash-alt', text: "Delete Pantry Item", color: "red", onPress: () => setMenuStageOpen("DELETE")}
                    ]} 
                    menuStageOpen={menuStageOpen}
                    closeMenu={() => {
                        setItemOpenInMenu("")
                        setMenuStageOpen("MENU")
                    }}
                    itemOpenInMenu={itemOpenInMenu}
                    menuType={"PANTRY"}
                />
            )}
        </View>
    )
}

// ---------------------
// Style Definitions
// ---------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: stylesColors.mainBackground,
        body: {
            flex: 0.85,
            width: "100%",
            category: {
                width: "100%",
                padding: 20,
                justifyContent: 'flex-start',
                headingContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                    heading: {
                        color: stylesColors.textColorLight,
                        fontSize: 20,
                        paddingRight: 10
                    }
                }
            }
        },
        floatingButton: {
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            bottom: Dimensions.get('window').width * 0.05,
            right: Dimensions.get('window').width * 0.05,
            width: Dimensions.get('window').width * 0.25,
            height: Dimensions.get('window').width * 0.25,
            borderRadius: Dimensions.get('window').width * 0.25,
            backgroundColor: stylesColors.yellow,
            borderColor: stylesColors.borderColorDark,
            borderWidth: 2
        }
    },
    
})

export default Pantry;