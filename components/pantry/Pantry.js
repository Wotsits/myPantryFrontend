import React, { startTransition, useEffect, useState, useContext } from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Dimensions} from 'react-native'
import Header from '../main/Header'
import PantryItemList from './PantryItemList'
import { UserContext } from '../../contexts/UserContext';
import SlidingMenu from '../slidingMenu/slidingMenu';
import {api} from '../../settings'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { stylesColors } from '../../styleObjects';
import FloatingButton from '../FloatingButton/FloatingButton';

const Pantry = ({setActiveView, toggleNav}) => {
    const [categories, setCategories] = useState([])
    const {token} = useContext(UserContext)
    const [itemOpenInMenu, setItemOpenInMenu] = useState("")
    const [menuStageOpen, setMenuStageOpen] = useState("MENU")

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
            throw new Error('Something went wrong');
        })
        .then(data => {
            setCategories(data)
        })
        .catch((error) => {
            console.error(error)
        })
    }, [])

    return (
        <View style={styles.container}>
            <Header viewName={"My Pantry"} setActiveView={() => setActiveView(0)} toggleNav={toggleNav}/>
            <ScrollView style={styles.container.body}>
                {categories.map(category => (
                    <View key={category.id} style={styles.container.body.category}>
                        <View style={styles.container.body.category.headingContainer}>
                            <FontAwesome style={styles.container.body.category.headingContainer.heading} name={category.icon}/>
                            <Text style={styles.container.body.category.headingContainer.heading}>{category.name}</Text>
                        </View>
                        <PantryItemList categoryId={category.id} itemOpenInMenu={itemOpenInMenu} setItemOpenInMenu={setItemOpenInMenu}/>
                    </View>))}
            </ScrollView>
            <FloatingButton onPress={() => {
                    setItemOpenInMenu("0")
                    setMenuStageOpen("NEW")
                }}
            />
            {itemOpenInMenu && (
                <SlidingMenu 
                    buttons={[
                        {icon: 'pencil-alt', text: "Edit Pantry Item", color: "black", onPress: () => setMenuStageOpen("EDIT")},
                        {icon: 'trash-alt', text: "Delete Panty Item", color: "red", onPress: () => setMenuStageOpen("DELETE")}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#000000",
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
                        color: "#ffffff",
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