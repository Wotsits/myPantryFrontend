import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native'
import Header from '../main/Header'
import {api} from '../../settings'
import { UserContext } from '../../contexts/UserContext';
import { stylesColors } from '../../styleObjects';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const ShoppingList = ({setActiveView, toggleNav}) => {

    // ----------------
    // Context
    // ----------------

    const {token} = useContext(UserContext)

    // ----------------
    // State Declarations
    // ----------------

    const [shoppingList, setShoppingList] = useState([])
    const [shoppingListLoading, setShoppingListLoading] = useState(true)
    const [readyForRender, setReadyForRender] = useState(false)

    // ----------------
    // UseEffects
    // ----------------

    // on initial component load, call the shopping list items endpoint
    useEffect(() => {
        fetch(`${api}api/shoppingListItems/`, {
            method: "GET",
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            setShoppingListLoading(false)
            throw new Error(response.statusText);
        })
        .then(data => {
            const newShoppingList = data.map((item) => {
                return {
                    item,
                    isChecked: false
                }
            })
            setShoppingList(newShoppingList)
            setShoppingListLoading(false)
            setReadyForRender(true)
        })
        .catch((error) => {
            ToastAndroid.show('Failed to retrieve Shopping List Items', ToastAndroid.ERROR)
            console.error(error)
        })
    }, [])

    // ----------------
    // Event Handlers
    // ----------------

    /**
     * @description toggles the isChecked property of the shopping list item at the provided index.
     * @param {*} isChecked 
     * @param {*} index 
     */
    function handleCheckToggle(isChecked, index) {
        const newShoppingList = [...shoppingList]
        newShoppingList[index].isChecked = isChecked
        setShoppingList(newShoppingList)
    }

    /**
     * @description marks all checked items as purchased.
     * @returns
     */
    function markAsPurchased() {
        // get all checked items
        const payload = shoppingList.filter((item) => {
            return item.isChecked
        })

        // if there are no checked items, return.
        if (payload.length === 0) return
        
        // call the api to add the items to the pantry.
        fetch(`${api}api/addShoppingListItemsToPantry/`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                return
            }
            throw new Error(response.statusText);
        })
        .then(() => {
            const newShoppingList = shoppingList.filter((item) => {
                return !item.isChecked
            })
            setShoppingList(newShoppingList)
        })
        .catch((error) => {
            ToastAndroid.show('Failed to add items to pantry', ToastAndroid.ERROR)
            console.error(error)
        })
    }

    // ----------------
    // Render
    // ----------------

    if (!readyForRender) return <View style={styles.container}><Text style={{width: "100%", textAlign: "center", color: stylesColors.textColorLight}}>Loading...</Text></View>;
    return (
        <>
            {/* Header */}
            <Header viewName={"My Shopping List"} setActiveView={() => setActiveView(0)} toggleNav={toggleNav}/>
            
            {/* Shopping List */}
            <View style={styles.container}>
                {/* List loading */}
                {shoppingListLoading && <Text style={{color: "white", width: "100%", textAlign: "center"}}>Loading...</Text>}
                {/* Shopping List Items */}
                {!shoppingListLoading && shoppingList.length > 0 && (
                    <>
                    <View style={{backgroundColor: "black", width: "100%", flexDirection: "row", justifyContent: "flex-end", padding: 10}}><Text style={{color: stylesColors.textColorLight}} onPress={markAsPurchased}>Mark as purchased</Text></View>
                    <ScrollView>
                        {shoppingList.map((item, index) => {
                            return (
                                <View style={styles.shoppingListItem} key={item.item.id}>
                                    <View style={styles.shoppingListItem.contentContainer}>
                                        <Text style={{width: "50%"}}>{item.item.pantryItem.name}</Text>
                                        <Text>{item.item.quantity} {item.item.pantryItem.container}</Text>
                                        <BouncyCheckbox isChecked={item.isChecked} onPress={(isChecked) => {handleCheckToggle(isChecked, index)}} fillColor="black"/>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                    </>
                )}
                {/* No items on shopping list */}
                {!shoppingListLoading && shoppingList.length === 0 && <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}><Text style={{color: stylesColors.textColorLight}}>You have no items on your shopping list</Text></View>}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:"100%",
      backgroundColor: "black",
    },
    shoppingListItem: {
        flex: 1,
        width: "100%",
        padding: 30,
        borderBottomWidth: 2,
        backgroundColor: stylesColors.yellow,
        contentContainer: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            
        }
    }
})
export default ShoppingList;