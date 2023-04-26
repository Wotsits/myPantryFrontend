import React, { startTransition, useEffect, useState, useContext } from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Dimensions, Pressable, CheckBox, ToastAndroid} from 'react-native'
import Header from '../main/Header'
import { UserContext } from '../../contexts/UserContext';
import SlidingMenu from '../slidingMenu/slidingMenu';
import {api} from '../../settings'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import ListItem from '../ListItem';
import { stylesColors } from '../../styleObjects';
import RecipeDetail from './RecipeDetail';
import { UpdatesContext } from '../../contexts/UpdatesContext'
import FloatingButton from '../FloatingButton/FloatingButton';

const Recipes = ({setActiveView, toggleNav}) => {
    const {token} = useContext(UserContext)
    const {deleted, updated, created} = useContext(UpdatesContext)
    const [itemOpenInMenu, setItemOpenInMenu] = useState("")
    const [menuStageOpen, setMenuStageOpen] = useState("MENU")
    const [recipeOpen, setRecipeOpen] = useState(undefined)
    const [shoppingListCreationInProgress, setShoppingListCreationInProgress] = useState(false)
    const [consumeInProgess, setConsumeInProgress] = useState(false)
    const [readyForRender, setReadyForRender] = useState(false)

    const [recipes, setRecipes] = useState([])

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
            setRecipes(data.map(recipe => ({...recipe, servings: 0})))
            setReadyForRender(true)
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
                recipesCpy[matchingItemIndex] = {...updated, servings: 0}
                setRecipes(recipesCpy)
            }
        }
    }, [updated])

    useEffect(() => {
        if (created && recipes) {
            const recipesCpy = [...recipes]
            recipesCpy.push({...created, servings: 0})
            setRecipes(recipesCpy)
        }
    }, [created])

    // -------------------

    function handleMenuActivation(recipeId) {
        if (itemOpenInMenu === recipeId) {
            setItemOpenInMenu("")
        }
        if (itemOpenInMenu === "") {
            setItemOpenInMenu(recipeId)
        }
    }

    function handleFieldUpdate(index, value) {
        const recipesCpy = [...recipes]
        recipesCpy[index].servings = parseInt(value)
        setRecipes(recipesCpy)
    }

    function handleReset() {
        setShoppingListCreationInProgress(false)
        setConsumeInProgress(false)
        setRecipes(recipes.map(recipe => ({...recipe, servings: 0})))
    }

    function handleShoppingListSubmit() {
        const recipesToSubmit = recipes.filter(recipe => recipe.servings > 0)

        if (recipesToSubmit.length === 0) {
            handleReset()
            return
        }

        const payload = recipesToSubmit.map(recipe => ({id: recipe.id, servings: recipe.servings}))
        
        // reset the generate shopping list form 
        handleReset()

        fetch(`${api}api/generateShoppingList/`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                ToastAndroid.show('Shopping list generated - go to your shopping list.', ToastAndroid.SHORT)
                return
            }
            throw new Error('Something went wrong');
        })
        .catch((error) => {
            console.error(error)
        })
    }

    /**
     * @desctiption This function handles the submission of the consume recipes data.  It will send a post request to the server with the recipes and servings to consume.  It will then reset the form.
     * @returns void
     */
    function handleConsumeSubmit() {
        const recipesToSubmit = recipes.filter(recipe => recipe.servings > 0)

        if (recipesToSubmit.length === 0) {
            handleReset()
            return
        }

        const payload = recipesToSubmit.map(recipe => ({id: recipe.id, servings: recipe.servings}))
        
        // reset the generate shopping list form 
        handleReset()

        fetch(`${api}api/consumeRecipes/`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                ToastAndroid.show('Recipe consumption successful.', ToastAndroid.SHORT)
                return
            }
            throw new Error('Something went wrong');
        })
        .catch((error) => {
            console.error(error)
        })
    }

    if (!readyForRender) return <Text>Loading...</Text>
    if (recipeOpen) return (
        <View style={styles.container}>
            <Header viewName={"My Recipes"} setActiveView={() => setRecipeOpen(undefined)} toggleNav={toggleNav}/>
            <RecipeDetail recipeId={recipeOpen} setRecipeOpen={setRecipeOpen}/>
        </View>
        
    )
    return (
        <View style={styles.container}>
            <Header viewName={"My Recipes"} setActiveView={() => setActiveView(0)} toggleNav={toggleNav}/>
            {recipes.length === 0 && <Text>No recipes.  Why not add a recipe by clicking the yellow plus button?</Text>}
            {!shoppingListCreationInProgress && !consumeInProgess && (
                <View style={styles.container.submenuContainer}>
                    <Text style={styles.container.submenuContainer.createListButton} onPress={() => setConsumeInProgress(true)}>
                        Mark As Consumed
                    </Text>
                    <Text style={styles.container.submenuContainer.createListButton} onPress={() => setShoppingListCreationInProgress(true)}>
                        Create Shopping List
                    </Text>
                </View>
            )}
            {shoppingListCreationInProgress && (
                <View style={styles.container.submenuContainer}>
                    {recipes.filter(recipe => recipe.servings > 0).length > 0 && (
                        <View>
                            <Text style={styles.container.submenuContainer.createListButton} onPress={handleShoppingListSubmit}>
                                Generate
                            </Text>
                        </View>
                    )}
                    <View>
                        <Text style={styles.container.submenuContainer.createListButton} onPress={handleReset}>
                            Cancel
                        </Text>
                    </View>
                </View>
            )}
            {consumeInProgess && (
                <View style={styles.container.submenuContainer}>
                {recipes.filter(recipe => recipe.servings > 0).length > 0 && (
                    <View>
                        <Text style={styles.container.submenuContainer.createListButton} onPress={handleConsumeSubmit}>
                            Mark As Consumed
                        </Text>
                    </View>
                )}
                <View>
                    <Text style={styles.container.submenuContainer.createListButton} onPress={handleConsumeSubmit}>
                        Cancel
                    </Text>
                </View>
            </View>
            )}
            <ScrollView style={styles.container.body}>
                {recipes.length === 0 && <Text style={{color: 'white'}}>You have no saved recipes</Text>}
                {recipes.length > 0 && recipes.map((recipe, index) => (
                    <View key={recipe.id}>
                        <ListItem imageSrc={recipe.imageSrc || 'https://i.ibb.co/Cs7y1WZ/utensils-solid-removebg-preview.png'} itemActive={itemOpenInMenu === recipe.id} setItemOpen={() => setRecipeOpen(recipe.id)} handleMenuActivation={() => handleMenuActivation(recipe.id)} fieldValue={recipe.servings} exposeField={shoppingListCreationInProgress || consumeInProgess} callbackOnFieldChange={(value) => handleFieldUpdate(index, value)}>
                            <Text style={styles.container.item.contentContainer.title}>{recipe.name}</Text>
                        </ListItem>
                    </View>
                    
                ))}
            </ScrollView>
            <FloatingButton onPress={() => {
                    setItemOpenInMenu("0")
                    setMenuStageOpen("NEW")
                }}
            />
            {itemOpenInMenu && (
                <SlidingMenu 
                    buttons={[
                        {icon: 'pencil-alt', text: "Edit Recipe", color: "black", onPress: () => setMenuStageOpen("EDIT")},
                        {icon: 'trash-alt', text: "Delete Recipe", color: "red", onPress: () => setMenuStageOpen("DELETE")}
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
        submenuContainer: {
            width: "100%",
            flexDirection: 'row',
            justifyContent: 'flex-end',
            createListButton: {
                color: stylesColors.textColorLight,
                marginRight: 20,
                marginBottom: 20,
            }
        },
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
        }
    },
    
})

export default Recipes;