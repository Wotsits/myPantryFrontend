import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, TextInput, Text, Pressable, ToastAndroid} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { UserContext } from '../../contexts/UserContext';
import { UpdatesContext } from '../../contexts/UpdatesContext';
import { api } from '../../settings';
import {stylesColors, stylesFieldWithLabel} from '../../styleObjects'

const RecipeEditForm = ({itemBeingEditedId, closeMenu}) => {
    
    // ----------------
    // Context
    // ----------------

    const {token} = useContext(UserContext)
    const {setUpdated, setCreated} = useContext(UpdatesContext)
    
    // ----------------
    // State Declarations
    // ----------------

    const [readyForRender, setReadyForRender] = useState(false)
    const [name, setName] = useState("")
    const [serves, setServes] = useState("")
    const [imageSrc, setImageSrc] = useState("")

    // ----------------
    // UseEffects
    // ----------------

    // handle initial load.
    useEffect(() => {
        // call for the existing item.
        if (itemBeingEditedId !== "0") {
            fetch(`${api}api/recipe/${itemBeingEditedId}`, {
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
                setName(data.name)
                setServes(data.serves.toString())
                setImageSrc(data.imageSrc)
                setReadyForRender(true)
            })
            .catch((error) => {
                console.error(error)
            })
        }
        else setReadyForRender(true)
    }, [])

    // ----------------
    // Event Handlers
    // ----------------

    /**
     * @description A function which handles editing an existing recipe
     * @returns void
     */
    function handleEdit() {
        // validate the form.
        const isValid = name !== "" && serves !== ""
        // if the form is not valid, show a toast and return.
        if (!isValid) {
            ToastAndroid.show('Form invalid - Please complete all fields', ToastAndroid.SHORT)
            return
        }
        // if the form is valid, make the api call.
        const payload = {
            name: name,
            serves: parseInt(serves),
            imageSrc: imageSrc
        }
        fetch(`${api}api/recipe/${itemBeingEditedId}`, {
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
            ToastAndroid.show(`Successfully updated ${data.name}`, ToastAndroid.SHORT)
            closeMenu()
        })
        .catch(() => {
            ToastAndroid.show(`Update failed.  Please try again.`, ToastAndroid.SHORT)
        })
    }

    // ----------------
    // Event Handlers
    // ----------------

    /**
     * @description A function which handles creating a new recipe
     * @returns void
     */
    function handleCreate() {
        // validate the form.
        const isValid = name !== "" && serves !== ""
        if (!isValid) {
            ToastAndroid.show('Form invalid - Please complete all fields', ToastAndroid.SHORT)
            return
        }
        const payload = {
            name: name,
            serves: parseInt(serves),
            imageSrc: imageSrc
        }
        fetch(`${api}api/newRecipe/`, {
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
            ToastAndroid.show(`Successfully created ${data.name}`, ToastAndroid.SHORT)
            closeMenu()
        })
        .catch((error) => {
            console.error(error)
            ToastAndroid.show(`Creation failed.  Please try again.`, ToastAndroid.SHORT)
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
                {itemBeingEditedId !== "0" ? "Edit" : "New"}
            </Text>
            {itemBeingEditedId !== "0" && (
                <Text style={styles.subtitle}>
                    {name}
                </Text>
            )}

            {/* Form */}
            <View style={styles.form}> 
                {/* if I'm creating a new recipt, show the name field. */}
                {itemBeingEditedId === "0" && (
                    <View style={styles.inputContainer}>
                        <View style={stylesFieldWithLabel}>
                            <Text style={stylesFieldWithLabel.label}>Name *</Text>
                            <TextInput style={stylesFieldWithLabel.field} value={name} onChangeText={setName}/>
                        </View> 
                    </View>
                )}
                {/* Show all other fields */}
                <View style={styles.inputContainer}>
                    <View style={stylesFieldWithLabel}>
                        <Text style={stylesFieldWithLabel.label}>Serves *</Text>
                        <TextInput style={stylesFieldWithLabel.field} inputMode="numeric" keyboardType={"number-pad"} value={serves} onChangeText={setServes}/>
                    </View> 
                </View>
                <View style={styles.inputContainer}>
                    <View style={stylesFieldWithLabel}>
                        <Text style={stylesFieldWithLabel.label}>Image Source</Text>
                        <TextInput style={stylesFieldWithLabel.field} value={imageSrc} onChangeText={setImageSrc}/>
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
        inputLeft: {
            flex: 0.25,
            marginRight: 20,
        },
        inputRight: {
            flex: 0.75,
        }
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

export default RecipeEditForm