import React,{useContext} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Pressable, ToastAndroid} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import PantryItemEditForm from '../EditForms/PantryItemEditForm';
import RecipeEditForm from '../EditForms/RecipeEditForm';
import IngredientEditForm from '../EditForms/IngredientEditForm';
import { UserContext } from '../../contexts/UserContext';
import { UpdatesContext } from '../../contexts/UpdatesContext';
import { api } from '../../settings';


const SlidingMenu = ({buttons, menuStageOpen, closeMenu, itemOpenInMenu, menuType, relatedItemId}) => {
    const {token} =useContext(UserContext)
    const {setDeleted} = useContext(UpdatesContext)

    function handleDelete(menuType) {
        let deleteEndpoint = ""
        //set the endpoint based on the menuType
        if (menuType === "PANTRY") {
            deleteEndpoint = `${api}api/pantryItem/`
        }
        if (menuType === "RECIPE") {
            deleteEndpoint = `${api}api/recipe/`
        }
        if (menuType === "INGREDIENT") {
            deleteEndpoint = `${api}api/ingredient/`
        }
        fetch(`${deleteEndpoint}${itemOpenInMenu}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                setDeleted(itemOpenInMenu)
                ToastAndroid.show(`Successfully deleted ${menuType.toLowerCase()}`, ToastAndroid.SHORT)
                return
            }
            throw new Error('Something went wrong');
        })
        .catch((error) => {
            console.error(error)
        })
    }
    
    if (menuStageOpen === "MENU") {
        return (
            <View style={styles.slidingMenu}>
                <View style={styles.slidingMenu.closeContainer}>
                    <FontAwesome name="times" size={24} onPress={closeMenu}/>
                </View>
                <View styles={styles.slidingMenu.contentContainer}>
                    {buttons && (
                        <View style={styles.slidingMenu.contentContainer.buttonContainer}>
                            {buttons.map(button => (
                                <Pressable key={button.text} style={styles.slidingMenu.contentContainer.buttonContainer.button} onPress={button.onPress}>
                                    <FontAwesome name={button.icon} color={button.color} size={32}/>
                                    <Text style={{
                                        color: button.color,
                                        fontSize: 20,
                                        marginLeft: 20
                                    }}>{button.text}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        )
    }
    if (menuStageOpen === "EDIT" || menuStageOpen === "NEW") {
        return (
            <View style={styles.slidingMenu}>
                <View style={styles.slidingMenu.closeContainer}>
                    <FontAwesome name="times" size={24} onPress={closeMenu}/>
                </View>
                <View styles={styles.slidingMenu.contentContainer}>
                    {menuType === "PANTRY" && <PantryItemEditForm itemBeingEditedId={itemOpenInMenu} closeMenu={closeMenu}/>}
                    {menuType === "RECIPE" && <RecipeEditForm itemBeingEditedId={itemOpenInMenu} closeMenu={closeMenu}/>}
                    {menuType === "INGREDIENT" && <IngredientEditForm itemBeingEditedId={itemOpenInMenu} closeMenu={closeMenu} recipeId={relatedItemId}/>}
                </View>
            </View>
        )
    }
    if (menuStageOpen === "DELETE") {
        return (
            <View style={styles.slidingMenu}>
                <View style={styles.slidingMenu.closeContainer}>
                    <FontAwesome name="times" size={24} onPress={closeMenu}/>
                </View>
                <View styles={styles.slidingMenu.contentContainer}>
                    <View style={styles.slidingMenu.contentContainer.buttonContainer}>
                        <Pressable style={styles.slidingMenu.contentContainer.buttonContainer.deleteButton} onPress={() => handleDelete(menuType)}>
                            <FontAwesome name="trash-alt" color="white" size={32}/>
                            <Text style={{
                                color: "white",
                                fontSize: 20,
                                marginLeft: 20
                            }}>Confirm Delete</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }
    else return null
}

const styles = StyleSheet.create({
    slidingMenu: {
        position: 'absolute',
        width: '100%',
        padding: 10,
        bottom: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        closeContainer: {
            width: "100%",
            alignItems: "flex-end",
            backgroundColor: '#EEE8D7'
        },
        contentContainer: {
            width: "100%",
            justifyContent: 'center',
            alignItems: 'center',
            buttonContainer: {
                width: "100%",
                justifyContent: 'center',
                alignItems: 'center',
                button: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 10
                },
                deleteButton: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 10,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: "red"
                }
            },
        },
        backgroundColor: '#EEE8D7'
    }
})

export default SlidingMenu