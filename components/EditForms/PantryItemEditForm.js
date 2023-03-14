import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button, Pressable, ToastAndroid} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../../contexts/UserContext';
import { UpdatesContext } from '../../contexts/UpdatesContext';
import { api } from '../../settings';
import {stylesColors, stylesInputField, stylesFieldWithLabel} from '../../styleObjects'

const PantryItemEditForm = ({itemBeingEditedId, closeMenu}) => {
    
    const {token} = useContext(UserContext)
    const {setUpdated, setCreated} = useContext(UpdatesContext)
    const [readyForRender, setReadyForRender] = useState(false)

    const [name, setName] = useState("")
    const [capacity, setCapacity] = useState("")
    const [capacityMeasure, setCapacityMeasure] = useState("")
    const [container, setContainer] = useState("")
    const [onHand, setOnHand] = useState("")
    const [category, setCategory] = useState("Ambient")

    //------------
    //DROPDOWN SETUP
    const [categoryDropDownOpen, setCategoryDropDownOpen] = useState(false)
    const [categories, setCategories] = useState(undefined)
    const [capacityMeasuresDropDownOpen, setCapacityMeasuresDropDownOpen] = useState(false)
    const [capacityMeasures, setCapacityMeasures] = useState([
        {label: 'ml', value: 'ml'},
        {label: 'g', value: 'g'},
        {label: 'item', value: 'item'}
    ])
    const [containerDropDownOpen, setContainerDropDownOpen] = useState(false)
    const [containers, setContainers] = useState([
        {label: 'can', value: 'can'},
        {label: 'tube', value: 'tube'},
        {label: 'jar', value: 'jar'},
        {label: 'pack', value: 'pack'},
        {label: 'block', value: 'block'},
        {label: 'item', value: 'item'},
    ]);
    // -----------

    // -----------
    // HANDLE INITIAL LOAD
    useEffect(() => {
        //if we're creating a new item, call for the categories list.
        if (itemBeingEditedId === "0") {
            fetch(`${api}api/pantryItemCategories/`, {
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
                const categoriesForDropdown = data.map(category => {
                    return {label: category.name, value: category.id}
                })
                setCategories(categoriesForDropdown)
                setReadyForRender(true)
            })
            .catch((error) => {
                console.error(error)
            })
        }

        //otherwise, call for the existing item.
        if (itemBeingEditedId !== "0") {
            fetch(`${api}api/pantryItem/${itemBeingEditedId}`, {
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
                setCapacity(data.capacity.toString())
                setCapacityMeasure(data.capacityMeasure)
                setContainer(data.container)
                setOnHand(data.on_hand)
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
        const isValid = name !== "" && capacityMeasure !== "" && capacity !== "" && container !== "" && onHand !== ""
        if (isValid) {
            const payload = {
                name: name,
                capacity: parseInt(capacity),
                capacityMeasure: capacityMeasure,
                container: container,
                on_hand: parseFloat(onHand)
            }
            fetch(`${api}api/pantryItem/${itemBeingEditedId}`, {
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
        const isValid = name !== "" && capacityMeasure !== "" && capacity !== "" && container !== "" && onHand !== "" && category !== ""
        if (isValid) {
            const payload = {
                name: name,
                capacity: parseInt(capacity),
                capacityMeasure: capacityMeasure,
                container: container,
                category: category,
                on_hand: parseFloat(onHand)
            }
            fetch(`${api}api/newPantryItem/`, {
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
                    <>
                        <View style={styles.inputContainer}>
                            <View style={stylesFieldWithLabel}>
                                <Text style={stylesFieldWithLabel.label}>Name</Text>
                                <TextInput style={stylesFieldWithLabel.field} onChangeText={setName}/>
                            </View> 
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={[stylesFieldWithLabel, {zIndex: categoryDropDownOpen ? 1 : 0}]}>
                                <Text style={stylesFieldWithLabel.label}>Category</Text>
                                <DropDownPicker 
                                    open={categoryDropDownOpen}
                                    value={category}
                                    items={categories ? categories : ["Loading..."]}
                                    setOpen={() => {
                                        if (containerDropDownOpen) {
                                            setContainerDropDownOpen(false)
                                        }
                                        if (capacityMeasuresDropDownOpen) {
                                            setCapacityMeasuresDropDownOpen(false)
                                        }
                                        setCategoryDropDownOpen(!categoryDropDownOpen)
                                    }}
                                    setValue={setCategory}
                                    setItems={setCategories}
                                    zIndex={3000}
                                    zIndexInverse={1000}
                                    listMode="SCROLLVIEW"
                                />
                            </View> 
                        </View>
                    </>
                )}
                <View style={stylesFieldWithLabel}>
                    <Text style={stylesFieldWithLabel.label}>Capacity Of each container</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={[styles.inputContainer.inputLeft, stylesInputField]} value={capacity} onChangeText={setCapacity}/>
                        <View style={[styles.inputContainer.inputRight, {zIndex: capacityMeasuresDropDownOpen ? 1 : 0}]}>
                            <DropDownPicker 
                                style={styles.inputContainer.inputRight}
                                open={capacityMeasuresDropDownOpen}
                                value={capacityMeasure}
                                items={capacityMeasures}
                                setOpen={() => {
                                    if (containerDropDownOpen) {
                                        setContainerDropDownOpen(false)
                                    }
                                    if (categoryDropDownOpen) {
                                        setCategoryDropDownOpen(false)
                                    }
                                    setCapacityMeasuresDropDownOpen(!capacityMeasuresDropDownOpen)
                                }}
                                setValue={setCapacityMeasure}
                                setItems={setCapacityMeasures}
                                zIndex={2000}
                                zIndexInverse={2000}
                            />
                        </View>
                    </View>
                </View>
                <View style={stylesFieldWithLabel}>
                    <Text style={stylesFieldWithLabel.label}>Number of containers on hand</Text>
                    <View style={styles.inputContainer}>
                        <TextInput style={[styles.inputContainer.inputLeft, stylesInputField]} value={onHand} onChangeText={setOnHand}/>
                        <View style={[styles.inputContainer.inputRight, {zIndex: containerDropDownOpen ? 1 : 0}]}>
                            <DropDownPicker 
                                open={containerDropDownOpen}
                                value={container}
                                items={containers}
                                setOpen={() => {
                                    if (capacityMeasuresDropDownOpen) {
                                        setCapacityMeasuresDropDownOpen(false)
                                    }
                                    if (categoryDropDownOpen) {
                                        setCategoryDropDownOpen(false)
                                    }
                                    setContainerDropDownOpen(!containerDropDownOpen)
                                }}
                                setValue={setContainer}
                                setItems={setContainers}
                                zIndex={1000}
                                zIndexInverse={3000}
                            />
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

export default PantryItemEditForm