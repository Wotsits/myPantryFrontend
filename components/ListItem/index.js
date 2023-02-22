import React from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import { stylesColors } from '../../styleObjects';
import FontAwesome from '@expo/vector-icons/FontAwesome5'


const ListItem = ({ children, imageSrc, itemActive, handleMenuActivation }) => {

    return (
        <View style={styles.item}>
            {imageSrc && <Image source={imageSrc} style={styles.item.image}/>}
            <View style={[styles.item.contentContainer, {flex: imageSrc ? 0.60 : 0.80}]}>
                {children}
            </View>
            <View style={styles.item.ellipsisContainer}>
                <FontAwesome name={itemActive ? 'ellipsis-v' : 'ellipsis-h'} size={26} onPress={handleMenuActivation}/>
            </View>
        </View>
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
            flex: 0.20,
            justifyContent: 'center',
            alignItems: 'center'

        },
        contentContainer: {
            padding: 10,
        },
        ellipsisContainer: {
            flex: 0.20,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
})

export default ListItem;