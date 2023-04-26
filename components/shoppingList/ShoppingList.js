import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import Header from '../main/Header'
import {api} from '../../settings'
import { UserContext } from '../../contexts/UserContext';
import { stylesColors } from '../../styleObjects';
import BouncyCheckbox from "react-native-bouncy-checkbox";




const ShoppingList = ({setActiveView, toggleNav}) => {
    const {token} = useContext(UserContext)
    const [shoppingList, setShoppingList] = useState([])
    const [shoppingListLoading, setShoppingListLoading] = useState(true)

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
            throw new Error('Network response was not ok.');
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
        })
        .catch((error) => {
            console.error(error)
        })
    }, [])

    function handleCheckToggle(isChecked, index) {
        const newShoppingList = [...shoppingList]
        newShoppingList[index].isChecked = isChecked
        setShoppingList(newShoppingList)
    }

    function markAsPurchased() {
        const payload = shoppingList.filter((item) => {
            return item.isChecked
        })
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
            throw new Error('Network response was not ok.');
        })
        .then(() => {
            const newShoppingList = shoppingList.filter((item) => {
                return !item.isChecked
            })
            setShoppingList(newShoppingList)
        })
        .catch((error) => {
            console.error(error)
        })
    }

    return (
        <>
            <Header viewName={"My Shopping List"} setActiveView={() => setActiveView(0)} toggleNav={toggleNav}/>
            <View style={styles.container}>
                {shoppingListLoading && <Text style={{color: "white"}}>Loading...</Text>}
                {!shoppingListLoading && shoppingList.length > 0 && (
                    <>
                    <View style={{backgroundColor: "black", width: "100%", flexDirection: "row", justifyContent: "flex-end", padding: 10}}><Text style={{color: "white"}} onPress={markAsPurchased}>Mark as purchased</Text></View>
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
                {!shoppingListLoading && shoppingList.length === 0 && <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}><Text style={{color: "white"}}>You have no items on your shopping list</Text></View>}
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