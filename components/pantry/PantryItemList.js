import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import { UserContext } from '../../contexts/UserContext';
import { api } from '../../settings';
import PantryItemListItem from './PantryItemListItem';
import { UpdatesContext } from '../../contexts/UpdatesContext'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';

const PantryItemList = ({categoryId, itemOpenInMenu, setItemOpenInMenu}) => {
    const {token} =useContext(UserContext)
    const {deleted, updated, created} = useContext(UpdatesContext)

    const [itemList, setItemList] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (itemList.length > 0) {
            console.log("ITEMLIST: ", itemList)
        }
    }, [itemList])

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
            throw new Error('Something went wrong');
        })
        .then(data => {
            setItemList(data)
            setLoaded(true)
        })
        .catch((error) => {
            console.error(error)
        })
    }, [])

    useEffect(() => {
        const matchingItemIndex = itemList.findIndex(item => item.id === deleted)
        if (matchingItemIndex) {
            const itemListCpy = [...itemList]
            itemListCpy.splice(matchingItemIndex, 1)
            setItemList(itemListCpy)
        }
    }, [deleted])

    useEffect(() => {
        if (updated) {
            const matchingItemIndex = itemList.findIndex(item => item.id === updated.id)
            if (matchingItemIndex >= 0) {
                const itemListCpy = [...itemList]
                itemListCpy[matchingItemIndex] = updated
                setItemList(itemListCpy)
            }
        }
    }, [updated])

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

const styles = StyleSheet.create({
    listItem: {
        color: "#ffffff"
    }
})

export default PantryItemList