import React, {useContext, useState, useEffect} from 'react'   
import {View, StyleSheet, ImageBackground, ScrollView, Text, ToastAndroid} from 'react-native'
import { stylesColors } from '../../styleObjects';
import { UserContext } from '../../contexts/UserContext';
import {api} from '../../settings'
import ListItem from '../ListItem';
import SlidingMenu from '../slidingMenu/slidingMenu';
import { UpdatesContext } from '../../contexts/UpdatesContext'
import FloatingButton from '../FloatingButton/FloatingButton';

const RecipeDetail = ({recipeId}) => {

    // ---------------------
    // Context
    // ---------------------

    const {token} = useContext(UserContext)
    const {deleted, updated, created} = useContext(UpdatesContext)

    // ---------------------
    // State Declarations
    // ---------------------

    const [recipe, setRecipe] = useState(undefined)
    const [ingredients, setIngredients] = useState(undefined)
    const [itemOpenInMenu, setItemOpenInMenu] = useState("")
    const [menuStageOpen, setMenuStageOpen] = useState("MENU")

    // ---------------------
    // UseEffects
    // ---------------------

    // on first render, get the recipes.
    useEffect(() => {
        fetch(`${api}api/recipe/${recipeId}`, {
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
            setRecipe(data)
        })
        .catch((error) => {
            ToastAndroid.show('Failed to retrieve Recipe', ToastAndroid.ERROR)
            console.error(error)
        })
    }, [])

    // on first render, get the ingredients.
    useEffect(() => {
        fetch(`${api}api/ingredientsByRecipe/${recipeId}`, {
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
            setIngredients(data)
        })
        .catch((error) => {
            ToastAndroid.show('Failed to retrieve Ingredients', ToastAndroid.ERROR)
            console.error(error)
        })
    }, [])

    // -------------------
    // Manage item updates from the updateContext which is effectively a messaging system which allows various areas of the app to communicate.
    
    useEffect(() => {
        if (deleted && ingredients) {
            const matchingItemIndex = ingredients.findIndex(item => item.id === deleted)
            if (matchingItemIndex !== -1) {
                const ingredientsCpy = [...ingredients]
                ingredientsCpy.splice(matchingItemIndex, 1)
                setIngredients(ingredientsCpy)
            }
        }
    }, [deleted])

    useEffect(() => {
        if (updated && ingredients) {
            const matchingItemIndex = ingredients.findIndex(item => item.id === updated.id)
            if (matchingItemIndex !== -1) {
                // this is needed as the created item does not have the pantryItem object attached to it
                // so we need to fetch it from the server
                fetch(`${api}api/ingredient/${updated.id}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }).then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(response.statusText);
                }).then((data) => {
                    console.log(data)
                    const ingredientsCpy = [...ingredients]
                    ingredientsCpy[matchingItemIndex] = data
                    setIngredients(ingredientsCpy)
                }).catch((error) => {
                    ToastAndroid.show('Failed to retrieve Ingredient', ToastAndroid.ERROR)
                    console.error(error)
                })
            }
        }
    }, [updated])

    useEffect(() => {
        if (created && ingredients) {
            if (created.recipe === recipeId) {
                // this is needed as the created item does not have the pantryItem object attached to it
                // so we need to fetch it from the server
                fetch(`${api}api/ingredient/${created.id}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }).then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error(response.statusText);
                }).then((data) => {
                    const ingredientsCpy = [...ingredients]
                    ingredientsCpy.push(data)
                    setIngredients(ingredientsCpy)
                }).catch((error) => {
                    ToastAndroid.show('Failed to retrieve Ingredient', ToastAndroid.ERROR)
                    console.error(error)
                })
            }
        }
    }, [created])

    // ---------------------
    // Event Handlers
    // ---------------------

    /**
     * Handles the activation of the menu for a given ingredient.
     * @param {string} ingredientId
     * @returns {void}
     */
    function handleMenuActivation(ingredientId) {
        if (itemOpenInMenu === ingredientId) {
            setItemOpenInMenu("")
        }
        if (itemOpenInMenu === "") {
            setItemOpenInMenu(ingredientId)
        }
    }

    // ---------------------
    // Render
    // ---------------------

    if (!recipe || !ingredients) return <View style={styles.container}><Text style={{width: "100%", textAlign: "center", color: stylesColors.textColorLight}}>Loading...</Text></View>
    return (
        <View style={styles.container}>
            {/* Image with title overlay */}
            {recipe.imageSrc && (
                <ImageBackground style={styles.container.hero} source={{ uri: recipe.imageSrc }}>
                    <Text style={styles.container.hero.text}>{recipe.name}</Text>
                </ImageBackground>
            )}
            {!recipe.imageSrc && (
                <Text style={styles.container.hero.text}>{recipe.name}</Text>
            )}
            
            {/* Bit between the image/title and the ingredients.  */}
            <View style={styles.container.sectionTitle}>
                <Text style={styles.container.sectionTitle.title}>Ingredients</Text>
                <Text style={styles.container.sectionTitle.sub}>(Serves: {recipe.serves})</Text>
            </View>

            {/* Ingredients */}
            {ingredients.length === 0 && <View style={styles.container.noItems}><Text style={styles.container.noItems.text}>No ingredients added yet</Text></View>}
            {ingredients.length > 0 && (
                <ScrollView>
                    {ingredients.map(ingredient => (
                        <ListItem key={ingredient.id} itemActive={itemOpenInMenu === ingredient.id} setItemOpen={() => setItemOpenInMenu(recipe.id)} handleMenuActivation={() => handleMenuActivation(ingredient.id)}>
                            <View style={styles.container.item}>
                                <Text>{ingredient.pantryItem.name}</Text>
                                <Text>{ingredient.quantity} {ingredient.pantryItem.container}</Text>
                            </View>
                        </ListItem>
                    ))}

                </ScrollView>
                )}
            
            {/* Floating Button */}
            <FloatingButton onPress={() => {
                setItemOpenInMenu("0")
                setMenuStageOpen("NEW")
            }}/>

            {/* Sliding Menu */}
            {itemOpenInMenu && (
                <SlidingMenu 
                    buttons={[
                        {icon: 'pencil-alt', text: "Edit Ingredient", color: "black", onPress: () => setMenuStageOpen("EDIT")},
                        {icon: 'trash-alt', text: "Delete Ingredient", color: "red", onPress: () => setMenuStageOpen("DELETE")}
                    ]} 
                    menuStageOpen={menuStageOpen}
                    closeMenu={() => {
                        setItemOpenInMenu("")
                        setMenuStageOpen("MENU")
                    }}
                    itemOpenInMenu={itemOpenInMenu}
                    menuType={"INGREDIENT"}
                    relatedItemId={recipe.id}
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
        closeContainer: {
            width: "100%",
            alignItems: "flex-end",
            paddingRight: 20,
        },
        hero: {
            height: 200,
            justifyContent: "flex-end",
            paddingBottom: 20,
            text: {
                color: stylesColors.textColorLight,
                backgroundColor: "rgba(0,0,0,0.5)",
                fontSize: 27,
                padding: 10,
            }
        },
        sectionTitle: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            title: {
                color: stylesColors.textColorLight,
                fontSize: 24,
            },
            sub: {
                color: stylesColors.textColorLight,
                fontSize: 18,
            }
        },
        item: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        noItems: {
            flex: 0.5,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            text: {
                color: stylesColors.textColorLight,
                fontSize: 18,
            }
        }
    }
})

export default RecipeDetail