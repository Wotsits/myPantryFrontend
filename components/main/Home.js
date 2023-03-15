import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Text, Button} from 'react-native'
import MainNavigation from '../main/MainNavigation'
import NavigationPane from '../NavigationPane/NavigationPane';
import Pantry from '../pantry/Pantry'
import Planner from '../planner/Planner'
import Recipes from '../recipes/Recipes'
import ShoppingList from '../shoppingList/ShoppingList'


const Home = () => {
    const [activeView, setActiveView] = useState(0)
    const [navOpen, setNavOpen] = useState(false)

    function handleSetActiveView(view) {
        setActiveView(view)
    }

    function toggleNav() {
        console.log("toggle")
        setNavOpen(!navOpen)
    }

    if (activeView === 0) {
        return (
            <>
                <MainNavigation setActiveView={handleSetActiveView} toggleNav={toggleNav}/>
                <NavigationPane navOpen={navOpen} toggleNav={toggleNav} setActiveView={setActiveView}/>
            </>
        )
    }
    if (activeView === 1) {
        return (
            <>
                <Pantry setActiveView={handleSetActiveView} toggleNav={toggleNav}/>
                <NavigationPane navOpen={navOpen} toggleNav={toggleNav} setActiveView={setActiveView}/>
            </>
        )
    }
    if (activeView === 2) {
        return (
            <>
                <Recipes setActiveView={handleSetActiveView} toggleNav={toggleNav}/>
                <NavigationPane navOpen={navOpen} toggleNav={toggleNav} setActiveView={setActiveView}/>
            </>
        )
    }
    if (activeView === 3) {
        return (
            <>
                <Planner setActiveView={handleSetActiveView} toggleNav={toggleNav}/>
                <NavigationPane navOpen={navOpen} toggleNav={toggleNav} setActiveView={setActiveView}/>
            </>
        )
    }
    if (activeView === 4) {
        return (
            <>
                <ShoppingList setActiveView={handleSetActiveView} toggleNav={toggleNav}/>
                <NavigationPane navOpen={navOpen} toggleNav={toggleNav} setActiveView={setActiveView}/>
            </>
        )
    }
    return null
}



export default Home;