import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, TextInput, Text, Pressable} from 'react-native'
import { stylesColors } from '../../styleObjects';
import FontAwesome from '@expo/vector-icons/FontAwesome5'

/* 
EXPLANATION OF PROPS:
- children: the content of the ListItem
- imageSrc: the source of the image to be displayed in the ListItem
- itemActive: whether the ListItem is active or not
- handleMenuActivation: the function to be called when the menu is activated
- setItemOpen: the function to be called when the ListItem is pressed 
- fieldValue: the value of the field to be displayed
- exposeField: whether the field should be displayed or not
- callbackOnFieldChange: the function to be called when the field is changed
*/

const ListItem = ({ children, imageSrc, itemActive, handleMenuActivation, setItemOpen, fieldValue, exposeField, callbackOnFieldChange}) => {
    // ---------------------
    // State Declarations
    // ---------------------

    const [localFieldValue, setLocalFieldValue] = useState(fieldValue ? fieldValue.toString() : "0");

    // ---------------------
    // UseEffects
    // ---------------------

    // when the incoming filed value changes, update the local field value to match.  
    // This allows reset from parent.
    useEffect(() => {
        if (fieldValue) setLocalFieldValue(fieldValue.toString())
    }, [fieldValue])

    // when the local field value changes, call the callback function.
    useEffect(() => {
        if (localFieldValue !== "") {
            if (callbackOnFieldChange) {
                callbackOnFieldChange(localFieldValue)
            }
        }
    }, [localFieldValue])

    // ---------------------
    // Event Handlers
    // ---------------------

    /**
     * @description A function which handles changes to the field value
     * @param {object} event The event object   
     * @returns void
     */ 
    function handleFieldValueChange(event) {
        setLocalFieldValue(event.nativeEvent.text)
    }

    // ---------------------
    // Render
    // ---------------------

    return (
        <Pressable onPress={setItemOpen}>
            <View style={styles.item}>
                {imageSrc && <Image source={{uri: imageSrc}} style={styles.item.image}/>}
                <View style={[styles.item.contentContainer, {flex: imageSrc ? 0.50 : 0.80}]}>
                    {children}
                </View>
                <View style={styles.item.ellipsisContainer}>
                    {exposeField && (
                        <>
                            <Text>Servings</Text>
                            <TextInput style={{borderWidth: 1, backgroundColor: stylesColors.borderColorLight, width: "100%", textAlign: 'center'}} value={localFieldValue} onChange={handleFieldValueChange} keyboardType='number-pad' inputMode='numeric'/>
                        </>
                    )}
                    {!exposeField && <FontAwesome name={itemActive ? 'ellipsis-v' : 'ellipsis-h'} size={26} onPress={handleMenuActivation}/>}
                </View>
            </View>
        </Pressable>
    );
}

// ---------------------
// Style Definitions
// ---------------------

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
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
        }
    }
})

export default ListItem;