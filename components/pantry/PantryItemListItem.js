import React, { useState, useEffect } from 'react'
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import ListItem from '../ListItem'


const PantryItemListItem = ({ id, name, onHand, container, capacity, capacityMeasure, itemOpenInMenu, setItemOpenInMenu }) => {

    function handleMenuActivation() {
        if (itemOpenInMenu === id) {
            setItemOpenInMenu("")
        }
        if (itemOpenInMenu === "") {
            setItemOpenInMenu(id)
        }
    }

    return (
        <ListItem itemActive={itemOpenInMenu === id} handleMenuActivation={handleMenuActivation}>
            <View>
                <Text style={styles.contentContainer.title}>{name}</Text>
            </View>
            <View style={styles.contentContainer.bottomLine}>
                <Text style={styles.text}>{onHand} {container}</Text>
                <Text style={styles.text}>{capacity}{capacityMeasure}</Text>
            </View>
        </ListItem>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 0.80,
        title: {
            fontSize: 18
        },
        bottomLine: {
            flexDirection: "row",
            justifyContent: 'space-between'
        },
    },
})

export default PantryItemListItem