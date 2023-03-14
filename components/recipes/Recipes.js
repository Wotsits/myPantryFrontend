import React, { startTransition, useEffect, useState, useContext } from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Dimensions, Pressable} from 'react-native'
import Header from '../main/Header'
import { UserContext } from '../../contexts/UserContext';
import SlidingMenu from '../slidingMenu/slidingMenu';
import {api} from '../../settings'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import ListItem from '../ListItem';
import { stylesColors } from '../../styleObjects';
import RecipeDetail from './RecipeDetail';
import { UpdatesContext } from '../../contexts/UpdatesContext'

const Recipes = ({setActiveView}) => {
    const {token} = useContext(UserContext)
    const {deleted, updated, created} = useContext(UpdatesContext)
    const [itemOpenInMenu, setItemOpenInMenu] = useState("")
    const [menuStageOpen, setMenuStageOpen] = useState("MENU")
    const [recipeOpen, setRecipeOpen] = useState(undefined)

    const [recipes, setRecipes] = useState(undefined)

    useEffect(() => {
        fetch(`${api}api/recipes/`, {
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
            setRecipes(data)
        })
        .catch((error) => {
            console.error(error)
        })
    }, [])

    // -------------------
    // Manage item updates from the updateContext which is effectively a messaging system which allows various areas of the app to communicate.
    
    useEffect(() => {
        if (deleted && recipes) {
            const matchingItemIndex = recipes.findIndex(item => item.id === deleted)
            if (matchingItemIndex !== -1) {
                const recipesCpy = [...recipes]
                recipesCpy.splice(matchingItemIndex, 1)
                setRecipes(recipesCpy)
            }
        }
    }, [deleted])

    useEffect(() => {
        if (updated && recipes) {
            const matchingItemIndex = recipes.findIndex(item => item.id === updated.id)
            if (matchingItemIndex !== -1) {
                const recipesCpy = [...recipes]
                recipesCpy[matchingItemIndex] = updated
                setRecipes(recipesCpy)
            }
        }
    }, [updated])

    useEffect(() => {
        if (created && recipes) {
            const recipesCpy = [...recipes]
            recipesCpy.push(created)
            setRecipes(recipesCpy)
        }
    }, [created])

    // -------------------

    if (!recipes) return <Text>Loading...</Text>
    if (recipeOpen) return (
        <View style={styles.container}>
            <Header viewName={"My Recipes"} setActiveView={setActiveView}/>
            <RecipeDetail recipeId={recipeOpen} setRecipeOpen={setRecipeOpen}/>
        </View>
        
    )
    return (
        <View style={styles.container}>
            <Header viewName={"My Recipes"} setActiveView={setActiveView}/>
            <ScrollView style={styles.container.body}>
                {recipes.length === 0 && <Text style={{color: 'white'}}>You have no saved recipes</Text>}
                {recipes.length > 0 && recipes.map(recipe => (
                    <View>
                        <ListItem imageSrc={recipe.imageSrc || 'https://i.ibb.co/Cs7y1WZ/utensils-solid-removebg-preview.png'} setItemOpen={() => setRecipeOpen(recipe.id)}>
                            <Text style={styles.container.item.contentContainer.title}>{recipe.name}</Text>
                        </ListItem>
                    </View>
                    
                ))}
            </ScrollView>
            <View style={styles.container.floatingButton}>
                <FontAwesome name="plus" size={50} onPress={() => {
                    setItemOpenInMenu("0")
                    setMenuStageOpen("NEW")
                }}/>
            </View>
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
                    menuType={"RECIPE"}
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
        item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 15,
            backgroundColor: '#F7AD08',
            borderTopWidth: 2,
            borderBottomWidth: 2,
            borderTopColor: "#ffffff",
            borderBottomColor: "#ffffff",
            contentContainer: {
                flex: 0.80,
                flexDirection: 'row',
                alignItems: "center",
                image: {
                    width: 100,
                    height: 100,
                    marginRight: 10
                },
                title: {
                    fontSize: 18,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                },
            },
            ellipsisContainer: {
                flex: 0.20,
                justifyContent: 'center',
                alignItems: 'center'
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

export default Recipes;