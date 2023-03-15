import React from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Pressable} from 'react-native'
import { stylesColors } from '../../styleObjects';
import FontAwesome from '@expo/vector-icons/FontAwesome5'

// EXPLANATION OF PROPS:
// children: the content of the ListItem
// imageSrc: the source of the image to be displayed in the ListItem
// itemActive: whether the ListItem is active or not
// handleMenuActivation: the function to be called when the menu is activated
// setItemOpen: the function to be called when the ListItem is pressed 

const ListItem = ({ children, imageSrc, itemActive, handleMenuActivation, setItemOpen}) => {

    return (
        <Pressable onPress={setItemOpen}>
            <View style={styles.item}>
                {imageSrc && <Image source={{uri: imageSrc}} style={styles.item.image}/>}
                <View style={[styles.item.contentContainer, {flex: imageSrc ? 0.60 : 0.80}]}>
                    {children}
                </View>
                <View style={styles.item.ellipsisContainer}>
                    <FontAwesome name={itemActive ? 'ellipsis-v' : 'ellipsis-h'} size={26} onPress={handleMenuActivation}/>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: stylesColors.yellow,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: stylesColors.borderColorLight,
        borderBottomColor: stylesColors.borderColorLight,
        image: {
            flex: 0.30,
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            width: '100%'

        },
        contentContainer: {
            padding: 10,
            justifyContent: 'center',

        },
        ellipsisContainer: {
            flex: 0.20,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
})

export default ListItem;