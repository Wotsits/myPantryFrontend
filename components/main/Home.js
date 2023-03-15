import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import MainNavigation from '../main/MainNavigation'
import Pantry from '../pantry/Pantry'
import Planner from '../planner/Planner'
import Recipes from '../recipes/Recipes'
import ShoppingList from '../shoppingList/ShoppingList'


const Home = () => {
    const [activeView, setActiveView] = useState(0)

    function handleSetActiveView(view) {
        setActiveView(view)
    }

    if (activeView === 0) {
        return <MainNavigation setActiveView={handleSetActiveView} />
    }
    if (activeView === 1) {
        return <Pantry setActiveView={handleSetActiveView} />
    }
    if (activeView === 2) {
        return <Recipes setActiveView={handleSetActiveView} />
    }
    if (activeView === 3) {
        return <Planner setActiveView={handleSetActiveView} />
    }
    if (activeView === 4) {
        return <ShoppingList setActiveView={handleSetActiveView} />
    }
    return null
}



export default Home;