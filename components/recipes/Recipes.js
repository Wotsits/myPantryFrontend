import React, { useEffect, useState, useContext } from 'react';
import {View, StyleSheet, ScrollView, Text, ToastAndroid} from 'react-native'
import Header from '../main/Header'
import { UserContext } from '../../contexts/UserContext';
import SlidingMenu from '../slidingMenu/slidingMenu';
import {api} from '../../settings'
import ListItem from '../ListItem';
import { stylesColors } from '../../styleObjects';
import RecipeDetail from './RecipeDetail';
import { UpdatesContext } from '../../contexts/UpdatesContext'
import FloatingButton from '../FloatingButton/FloatingButton';

const Recipes = ({setActiveView, toggleNav}) => {

    // -------------------
    // Context
    // -------------------

    const {token} = useContext(UserContext)
    const {deleted, updated, created} = useContext(UpdatesContext)

    // -------------------
    // State Declarations
    // -------------------

    const [itemOpenInMenu, setItemOpenInMenu] = useState("")
    const [menuStageOpen, setMenuStageOpen] = useState("MENU")
    const [recipeOpen, setRecipeOpen] = useState(undefined)
    const [shoppingListCreationInProgress, setShoppingListCreationInProgress] = useState(false)
    const [consumeInProgess, setConsumeInProgress] = useState(false)
    const [readyForRender, setReadyForRender] = useState(false)
    const [recipes, setRecipes] = useState([])

    // -------------------
    // UseEffects
    // -------------------

    // on first render, get the recipes.
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
            throw new Error(response.statusText);
        })
        .then(data => {
            setRecipes(data.map(recipe => ({...recipe, servings: 0})))
            setReadyForRender(true)
        })
        .catch((error) => {
            ToastAndroid.show('Failed to retrieve Recipes', ToastAndroid.ERROR)
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
    // Event Handlers
    // -------------------

    /**
     * @description This function handles the opening and closing of the sliding menu.  It will set the itemOpenInMenu state to the provided recipeId.  If the itemOpenInMenu state is already set to the provided recipeId, it will set the itemOpenInMenu state to an empty string.
     * @param {string} recipeId
     * @returns void
     */
    function handleMenuActivation(recipeId) {
        if (itemOpenInMenu === recipeId) {
            setItemOpenInMenu("")
        }
        if (itemOpenInMenu === "") {
            setItemOpenInMenu(recipeId)
        }
    }

    /**
     * @description This function handles the updating of the servings field for a recipe.  It will update the servings field for the recipe at the provided index with the provided value. 
     * @param {number} index
     * @param {number} value
     * @returns void
     */ 
    function handleFieldUpdate(index, value) {
        const recipesCpy = [...recipes]
        recipesCpy[index].servings = parseInt(value)
        setRecipes(recipesCpy)
    }

    /**
     * @description This function handles the resetting of the generate shopping list form.  It will set the shoppingListCreationInProgress state to false, the consumeInProgess state to false, and the servings field for all recipes to 0.
     * @returns void
     */
    function handleReset() {
        setShoppingListCreationInProgress(false)
        setConsumeInProgress(false)
        setRecipes(recipes.map(recipe => ({...recipe, servings: 0})))
    }

    /**
     * @desctiption This function handles the submission of the generate shopping list data.  It will send a post request to the server with the recipes and servings to generate a shopping list.  It will then reset the form.
     * @returns void
     */
    function handleShoppingListSubmit() {
        // filter out any recipes with 0 servings
        const recipesToSubmit = recipes.filter(recipe => recipe.servings > 0)

        // if there are no recipes with servings, reset the form and return.
        if (recipesToSubmit.length === 0) {
            handleReset()
            return
        }

        // create the payload for the post request
        const payload = recipesToSubmit.map(recipe => ({id: recipe.id, servings: recipe.servings}))
        
        // reset the generate shopping list form 
        handleReset()

        // send the post request
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
            throw new Error(response.statusText);
        })
        .catch((error) => {
            ToastAndroid.show('Failed to generate shopping list', ToastAndroid.ERROR)
            console.error(error)
        })
    }

    /**
     * @desctiption This function handles the submission of the consume recipes data.  It will send a post request to the server with the recipes and servings to consume.  It will then reset the form.
     * @returns void
     */
    function handleConsumeSubmit() {
        // filter out any recipes with 0 servings
        const recipesToSubmit = recipes.filter(recipe => recipe.servings > 0)

        // if there are no recipes with servings, reset the form and return.
        if (recipesToSubmit.length === 0) {
            handleReset()
            return
        }

        // create the payload for the post request
        const payload = recipesToSubmit.map(recipe => ({id: recipe.id, servings: recipe.servings}))
        
        // reset the generate shopping list form 
        handleReset()

        // send the post request
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
            throw new Error(response.statusText);
        })
        .catch((error) => {
            ToastAndroid.show('Failed to consume recipes', ToastAndroid.ERROR)
            console.error(error)
        })
    }

    // -------------------
    // Render
    // -------------------

    if (!readyForRender) return <Text>Loading...</Text>
    // if there is a recipe open, display it.
    if (recipeOpen) return (
        <View style={styles.container}>
            <Header viewName={"My Recipes"} setActiveView={() => setRecipeOpen(undefined)} toggleNav={toggleNav}/>
            <RecipeDetail recipeId={recipeOpen} setRecipeOpen={setRecipeOpen}/>
        </View>
        
    )
    // if there is no recipe open, display the recipes.
    return (
        <View style={styles.container}>
            
            {/* Header */}
            <Header viewName={"My Recipes"} setActiveView={() => setActiveView(0)} toggleNav={toggleNav}/>
            
            {/* Body */}
            {recipes.length === 0 && <Text>No recipes.  Why not add a recipe by clicking the yellow plus button?</Text>}

            {/* if there are no actions in progress */}
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

            {/* if there is a shopping list in progress */}
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

            {/* if there is a consume in progress */}
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

            {/* Always render the recipes if there are some. */}
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
            
            {/* Floating Button */}
            <FloatingButton onPress={() => {
                    setItemOpenInMenu("0")
                    setMenuStageOpen("NEW")
                }}
            />

            {/* Sliding Menu */}
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