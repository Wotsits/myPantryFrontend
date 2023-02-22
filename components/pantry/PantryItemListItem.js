import React, { useState, useEffect } from 'react'
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'


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
        <View style={styles.item}>
            <View style={styles.item.contentContainer}>
                <View>
                    <Text style={styles.item.contentContainer.title}>{name}</Text>
                </View>
                <View style={styles.item.contentContainer.bottomLine}>
                    <Text style={styles.item.text}>{onHand} {container}</Text>
                    <Text style={styles.item.text}>{capacity}{capacityMeasure}</Text>
                </View>
            </View>
            <View style={styles.item.ellipsisContainer}>
                <FontAwesome name={itemOpenInMenu === id ? 'ellipsis-v' : 'ellipsis-h'} size={26} onPress={handleMenuActivation}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F7AD08',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: "#ffffff",
        borderBottomColor: "#ffffff",
        contentContainer: {
            flex: 0.60,
            title: {
                fontSize: 18
            },
            bottomLine: {
                flexDirection: "row",
                justifyContent: 'space-between'
            },
        },
        ellipsisContainer: {
            flex: 0.20,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
})

export default PantryItemListItem