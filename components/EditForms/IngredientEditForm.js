import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TextInput, Text, Pressable, ToastAndroid, Keyboard} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../../contexts/UserContext';
import { UpdatesContext } from '../../contexts/UpdatesContext';
import { api } from '../../settings';
import {stylesColors, stylesFieldWithLabel} from '../../styleObjects'

const IngredientEditForm = ({itemBeingEditedId, closeMenu, recipeId}) => {
    
    // ----------------
    // Context
    // ----------------

    const {token} = useContext(UserContext)
    const {setUpdated, setCreated} = useContext(UpdatesContext)

    // ----------------
    // State Declarations
    // ----------------
    
    const [readyForRender, setReadyForRender] = useState(false)
    const [pantryItem, setPantryItem] = useState("")
    const [quantity, setQuantity] = useState("")
    const [pantryItemDropDownOpen, setPantryItemDropDownOpen] = useState(false)
    const [pantryItems, setPantryItems] = useState(undefined)
    
    // ----------------
    // UseEffects
    // ----------------

    // load the pantry items from the api on first render.
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
            ToastAndroid.show('Failed to retrieve Pantry Items', ToastAndroid.ERROR)
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
                throw new Error(response.statusText);
            })
            .then(data => {
                setPantryItem(data.pantryItem)
                setQuantity(data.quantity.toString())
                setReadyForRender(true)
            })
            .catch((error) => {
                ToastAndroid.show('Failed to retrieve Ingredient', ToastAndroid.ERROR)
                console.error(error)
            })
        }
        else setReadyForRender(true)
    }, [])

    // ----------------
    // Event Handlers
    // ----------------
    
    /**
     * @description A function which handles editing an existing ingredient
     * @returns void
     */
    function handleEdit() {
        // validate the form
        const isValid = pantryItem !== "" && quantity !== ""
        // if the form is not valid, return early and alert the user.
        if (!isValid) {
            ToastAndroid.show('Form invalid - Please complete all fields', ToastAndroid.SHORT)
            return
        }
        // if the form is valid, make the api call.
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
            throw new Error(response.statusText);
        })
        .then(data => {
            setUpdated(data)
            ToastAndroid.show(`Successfully updated ingredient`, ToastAndroid.SHORT)
            closeMenu()
        })
        .catch((error) => {
            ToastAndroid.show('Failed to update Ingredient', ToastAndroid.ERROR)
            console.error(error)
        })
    }

    /**
     * @description A function which handles creating a new ingredient
     * @returns void
     */
    function handleCreate() {
        // validate the form
        const isValid = pantryItem !== "" && quantity !== ""
        // if the form is not valid, return early and alert the user.
        if (!isValid) {
            ToastAndroid.show('Form invalid - Please complete all fields', ToastAndroid.SHORT)
            return
        }
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
            throw new Error(response.statusText);
        })
        .then(data => {
            setCreated(data)
            ToastAndroid.show(`Successfully created ingredient`, ToastAndroid.SHORT)
            closeMenu()
        })
        .catch((error) => {
            ToastAndroid.show('Failed to create Ingredient', ToastAndroid.ERROR)
            console.error(error)
        })
    }

    // ----------------
    // Render
    // ----------------

    if (!readyForRender) return <Text>Loading...</Text>
    return (
        <>
            {/* Title */}
            <Text style={styles.title}>
                {itemBeingEditedId !== "0" ? "Edit Ingredient" : "New Ingredient"}
            </Text>

            {/* Form */}
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
                            onOpen={() => Keyboard.dismiss()}
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

            {/* Save Button */}
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

// ----------------
// Style Definitions
// ----------------

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