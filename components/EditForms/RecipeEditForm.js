import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Pressable, ToastAndroid} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../../contexts/UserContext';
import { UpdatesContext } from '../../contexts/UpdatesContext';
import { api } from '../../settings';
import {stylesColors, stylesInputField, stylesFieldWithLabel} from '../../styleObjects'

const RecipeEditForm = ({itemBeingEditedId, closeMenu}) => {
    
    const {token} = useContext(UserContext)
    const {setUpdated, setCreated} = useContext(UpdatesContext)
    const [readyForRender, setReadyForRender] = useState(false)

    const [name, setName] = useState("")
    const [serves, setServes] = useState("")
    const [imageSrc, setImageSrc] = useState("")

    // -----------
    // HANDLE INITIAL LOAD
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

    // ----------

    // ----------
    // HANDLE EDIT AND CREATE
    function handleEdit() {
        const isValid = name !== "" && serves !== ""
        if (isValid) {
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
            .catch((error) => {
                console.error(error)
            })
        } else ToastAndroid.show('Form invalid - Please complete all fields', ToastAndroid.SHORT)
        
    }

    function handleCreate() {
        const isValid = name !== "" && serves !== ""
        if (isValid) {
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
            })
        }
        else ToastAndroid.show('Form invalid - Please complete all fields', ToastAndroid.SHORT)
    }
    // -----------

    if (!readyForRender) return <Text>Loading...</Text>
    else return (
        <>
            <Text style={styles.title}>
                {itemBeingEditedId !== "0" ? "Edit" : "New"}
            </Text>
            {itemBeingEditedId !== "0" && (
                <Text style={styles.subtitle}>
                    {name}
                </Text>
            )}
            <View style={styles.form}> 
                {itemBeingEditedId === "0" && (
                    <View style={styles.inputContainer}>
                        <View style={stylesFieldWithLabel}>
                            <Text style={stylesFieldWithLabel.label}>Name *</Text>
                            <TextInput style={stylesFieldWithLabel.field} value={name} onChangeText={setName}/>
                        </View> 
                    </View>
                )}
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