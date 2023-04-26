import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Pressable, ToastAndroid} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../../contexts/UserContext';
import { UpdatesContext } from '../../contexts/UpdatesContext';
import { api } from '../../settings';
import {stylesColors, stylesInputField, stylesFieldWithLabel, stylesWidthHalf} from '../../styleObjects'

const IngredientEditForm = ({itemBeingEditedId, closeMenu, recipeId}) => {
    
    const {token} = useContext(UserContext)
    const {setUpdated, setCreated} = useContext(UpdatesContext)
    const [readyForRender, setReadyForRender] = useState(false)

    // ----------------
    // FIELD STATE
    const [pantryItem, setPantryItem] = useState("")
    const [quantity, setQuantity] = useState("")
    // ----------------

    useEffect(() => {
        console.log("pantryItem", pantryItem)
    }, [pantryItem])

    // ----------------
    // DROPDOWN STATE
    const [pantryItemDropDownOpen, setPantryItemDropDownOpen] = useState(false)
    const [pantryItems, setPantryItems] = useState(undefined)
    // ----------------

    // ----------------
    // HANDLE INITIAL LOAD
    useEffect(() => {
        // regardless of whether we're editing or creating, we need to get the pantry items to populate the dropdown
        fetch(`${api}api/pantryItems/`, {
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
            const pantryItemsForDropdown = data.map(item => {
                return {label: item.name, value: item.id}
            })
            setPantryItems(pantryItemsForDropdown)
            setReadyForRender(true)
        })
        .catch((error) => {
            console.error(error)
        })
        // call for the existing item.
        if (itemBeingEditedId !== "0") {
            fetch(`${api}api/ingredient/${itemBeingEditedId}`, {
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
                setPantryItem(data.pantryItem)
                setQuantity(data.quantity.toString())
                setReadyForRender(true)
            })
            .catch((error) => {
                console.error(error)
            })
        }
        else setReadyForRender(true)
    }, [])

    // ----------------

    // ----------------
    // HANDLE EDIT AND CREATE
    function handleEdit() {
        const isValid = pantryItem !== "" && quantity !== ""
        if (isValid) {
            const payload = {
                recipe: recipeId,
                pantryItem: pantryItem.id,
                quantity: parseFloat(quantity),
            }
            fetch(`${api}api/ingredient/${itemBeingEditedId}`, {
                method: "PUT",
                body: JSON.stringify(payload),
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })
            .then(data => {
                setUpdated(data)
                ToastAndroid.show(`Successfully updated ingredient`, ToastAndroid.SHORT)
                closeMenu()
            })
            .catch((error) => {
                console.error(error)
            })
        } else ToastAndroid.show('Form invalid - Please complete all fields', ToastAndroid.SHORT)
        
    }

    function handleCreate() {
        const isValid = pantryItem !== "" && quantity !== ""
        if (isValid) {
            const payload = {
                recipe: recipeId,
                pantryItem: pantryItem,
                quantity: parseFloat(quantity),
            }
            fetch(`${api}api/newIngredient/`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })
            .then(data => {
                setCreated(data)
                ToastAndroid.show(`Successfully created ingredient`, ToastAndroid.SHORT)
                closeMenu()
            })
            .catch((error) => {
                console.error(error)
            })
        }
        else ToastAndroid.show('Form invalid - Please complete all fields', ToastAndroid.SHORT)
    }
    // ----------------

    if (!readyForRender) return <Text>Loading...</Text>
    else return (
        <>
            <Text style={styles.title}>
                {itemBeingEditedId !== "0" ? "Edit Ingredient" : "New Ingredient"}
            </Text>

            <>
                
            </>

            <View style={styles.form}> 
                <View style={styles.inputContainer}>
                    <View style={[stylesFieldWithLabel, {zIndex: pantryItemDropDownOpen ? 1 : 0}]}>
                        <Text style={stylesFieldWithLabel.label}>Pantry Item *</Text>
                        <DropDownPicker 
                            open={pantryItemDropDownOpen}
                            value={pantryItem.id}
                            items={pantryItems ? pantryItems : ["Loading..."]}
                            setOpen={() => {
                                setPantryItemDropDownOpen(!pantryItemDropDownOpen)
                            }}
                            setValue={setPantryItem}
                            setItems={setPantryItems}
                            zIndex={3000}
                            zIndexInverse={1000}
                            listMode="SCROLLVIEW"
                        />
                    </View> 
                </View>
                
                <View style={styles.inputContainer}>
                    <View style={stylesFieldWithLabel}>
                        <Text style={stylesFieldWithLabel.label}>Quantity * </Text>
                        <View style={stylesFieldWithLabel.twoPartField}>
                            <TextInput style={[stylesFieldWithLabel.field, stylesFieldWithLabel.twoPartField.item]} value={quantity} inputMode={"numeric"} keyboardType={"decimal-pad"} onChangeText={setQuantity}/>
                            <Text style={stylesFieldWithLabel.twoPartField.item}>{pantryItem.capacity}{pantryItem.capacityMeasure} {pantryItem.container}</Text>
                        </View>
                    </View> 
                </View>
                
            </View> 
            <View style={styles.buttonContainer}>
                <Pressable style={styles.buttonContainer.saveButton} onPress={itemBeingEditedId !== "0" ? handleEdit : handleCreate}>
                    <FontAwesome name="pencil-alt" color="white" size={32}/>
                    <Text style={{
                        color: "white",
                        fontSize: 20,
                        marginLeft: 20
                    }}>Save Changes</Text>
                </Pressable>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 24,
    },
    form: {
        marginTop: 20,
        marginBottom: 20
    },
    inputContainer: {
        flexDirection: "row",
        flex: 1
    },
    buttonContainer: {
        saveButton: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            padding: 10,
            borderRadius: 5,
            backgroundColor: stylesColors.positiveButtonGreen
        }
    }
})

export default IngredientEditForm