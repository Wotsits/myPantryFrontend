import React, {useContext, useState, useEffect} from 'react'   
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Pressable, Dimensions} from 'react-native'
import { stylesColors, stylesWhiteText } from '../../styleObjects';
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { UserContext } from '../../contexts/UserContext';
import {api} from '../../settings'
import ListItem from '../ListItem';
import SlidingMenu from '../slidingMenu/slidingMenu';
import { UpdatesContext } from '../../contexts/UpdatesContext'
import FloatingButton from '../FloatingButton/FloatingButton';

const RecipeDetail = ({recipeId}) => {
    const {token} = useContext(UserContext)
    const {deleted, updated, created} = useContext(UpdatesContext)

    const [recipe, setRecipe] = useState(undefined)
    const [ingredients, setIngredients] = useState(undefined)
    const [itemOpenInMenu, setItemOpenInMenu] = useState("")
    const [menuStageOpen, setMenuStageOpen] = useState("MENU")

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
            throw new Error('Something went wrong');
        })
        .then(data => {
            setRecipe(data)
        })
        .catch((error) => {
            console.error(error)
        })
    }, [])

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
            throw new Error('Something went wrong');
        })
        .then(data => {
            setIngredients(data)
        })
        .catch((error) => {
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
                const ingredientsCpy = [...ingredients]
                ingredientsCpy[matchingItemIndex] = updated
                setIngredients(ingredientsCpy)
            }
        }
    }, [updated])

    useEffect(() => {
        if (created && ingredients) {
            if (created.recipe.id === recipeId) {
                const ingredientsCpy = [...ingredients]
                ingredientsCpy.push(created)
                setIngredients(ingredientsCpy)
            }
        }
    }, [created])

    // -------------------

    function handleMenuActivation(ingredientId) {
        if (itemOpenInMenu === ingredientId) {
            setItemOpenInMenu("")
        }
        if (itemOpenInMenu === "") {
            setItemOpenInMenu(ingredientId)
        }
    }

    if (!recipe || !ingredients) return <Text>Loading...</Text>
    return (
        <View style={styles.container}>
            {recipe.imageSrc && (
                <ImageBackground style={styles.container.hero} source={{ uri: recipe.imageSrc }}>
                    <Text style={styles.container.hero.text}>{recipe.name}</Text>
                </ImageBackground>
            )}
            {!recipe.imageSrc && (
                <Text style={styles.container.hero.text}>{recipe.name}</Text>
            )}
            
            <View style={styles.container.sectionTitle}>
                <Text style={styles.container.sectionTitle.title}>Ingredients</Text>
                <Text style={styles.container.sectionTitle.sub}>(Serves: {recipe.serves})</Text>
                <FontAwesome name="pencil-alt" size={24} color="white"/>
            </View>
            {ingredients.length === 0 && <View style={styles.container.noItems}><Text style={styles.container.noItems.text}>No ingredients added yet</Text></View>}
            {ingredients.length > 0 && ingredients.map(ingredient => (
                <ListItem itemActive={itemOpenInMenu === ingredient.id} setItemOpen={() => setItemOpenInMenu(recipe.id)} handleMenuActivation={() => handleMenuActivation(ingredient.id)}>
                    <View style={styles.container.item}>
                        <Text>{ingredient.pantryItem.name}</Text>
                        <Text>{ingredient.quantity} {ingredient.pantryItem.container}</Text>
                    </View>
                </ListItem>
            ))}
            <FloatingButton onPress={() => {
                setItemOpenInMenu("0")
                setMenuStageOpen("NEW")
            }}/>
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
            flex: 0.4,
            justifyContent: "flex-end",
            paddingBottom: 20,
            text: {
                ...stylesWhiteText,
                backgroundColor: "rgba(0,0,0,0.5)",
                fontSize: 30,
                padding: 10,
            }
        },
        sectionTitle: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            title: {
                ...stylesWhiteText,
                fontSize: 24,
            },
            sub: {
                ...stylesWhiteText,
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
                ...stylesWhiteText,
                fontSize: 18,
            }
          
        }
    }
})

export default RecipeDetail