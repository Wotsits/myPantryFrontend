import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import MainNavigation from '../main/MainNavigation'
import Pantry from '../pantry/Pantry'
import Planner from '../planner/Planner'
import Recipes from '../recipes/Recipes'
import ShoppingList from '../shoppingList/ShoppingList'


const Home = () => {
    const [activeView, setActiveView] = useState(0)

    if (activeView === 0) {
        return <MainNavigation setActiveView={setActiveView} />
    }
    if (activeView === 1) {
        return <Pantry setActiveView={setActiveView} />
    }
    if (activeView === 2) {
        return <Recipes setActiveView={setActiveView} />
    }
    if (activeView === 3) {
        return <Planner setActiveView={setActiveView} />
    }
    if (activeView === 4) {
        return <ShoppingList setActiveView={setActiveView} />
    }
    return null
}



export default Home;