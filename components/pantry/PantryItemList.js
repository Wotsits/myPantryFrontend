import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native'
import { UserContext } from '../../contexts/UserContext';
import { api } from '../../settings';
import PantryItemListItem from './PantryItemListItem';
import { UpdatesContext } from '../../contexts/UpdatesContext'
import { stylesColors } from '../../styleObjects';

const PantryItemList = ({categoryId, itemOpenInMenu, setItemOpenInMenu}) => {
    
    // ---------------------
    // Context
    // ---------------------

    const {token} =useContext(UserContext)
    const {deleted, updated, created} = useContext(UpdatesContext)

    // ---------------------
    // State Declarations
    // ---------------------

    const [itemList, setItemList] = useState([])
    const [loaded, setLoaded] = useState(false)

    // ---------------------
    // UseEffects
    // ---------------------

    // grab the pantry items for the provided category id on load.
    useEffect(() => {
        fetch(`${api}api/pantryItemsByCategory/${categoryId}`, {
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
            setItemList(data)
            setLoaded(true)
        })
        .catch((error) => {
            ToastAndroid.show('Failed to retrieve Pantry Items', ToastAndroid.ERROR)
            console.error(error)
        })
    }, [])

    // -------------------
    // Manage item updates from the updateContext which is effectively a messaging system which allows various areas of the app to communicate.
    
    useEffect(() => {
        if (deleted && itemList) {
            const matchingItemIndex = itemList.findIndex(item => item.id === deleted)
            if (matchingItemIndex !== -1) {
                const itemListCpy = [...itemList]
                itemListCpy.splice(matchingItemIndex, 1)
                setItemList(itemListCpy)
            }
        }
    }, [deleted])

    useEffect(() => {
        if (updated && itemList) {
            const matchingItemIndex = itemList.findIndex(item => item.id === updated.id)
            if (matchingItemIndex !== -1) {
                const itemListCpy = [...itemList]
                itemListCpy[matchingItemIndex] = updated
                setItemList(itemListCpy)
            }
        }
    }, [updated])

    useEffect(() => {
        if (created && itemList) {
            if (created.category === categoryId) {
                const itemListCpy = [...itemList]
                itemListCpy.push(created)
                setItemList(itemListCpy)
            }
        }
    }, [created])

    // ---------------------
    // Render
    // ---------------------

    return (
        <View>
            {!loaded && <Text style={styles.listItem}>Loading...</Text>}
            {loaded && itemList.length === 0 && <Text style={styles.listItem}>No items in this category.</Text>}
            {loaded && itemList.map(item => 
                <PantryItemListItem 
                    key={item.id} 
                    id={item.id} 
                    name={item.name} 
                    onHand={item.on_hand} 
                    container={item.container} 
                    capacity={item.capacity} 
                    capacityMeasure={item.capacityMeasure} 
                    itemOpenInMenu={itemOpenInMenu} 
                    setItemOpenInMenu={setItemOpenInMenu}
                />)}
        </View>
    )
} 

// ---------------------
// Style Definitions
// ---------------------

const styles = StyleSheet.create({
    listItem: {
        color: stylesColors.textColorLight
    }
})

export default PantryItemList