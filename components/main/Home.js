import React, {useState} from 'react';
import MainNavigation from '../main/MainNavigation'
import NavigationPane from '../NavigationPane/NavigationPane';
import Pantry from '../pantry/Pantry'
import Recipes from '../recipes/Recipes'
import ShoppingList from '../shoppingList/ShoppingList'

const Home = () => {
    // ---------------------
    // State Declarations
    // ---------------------
    
    const [activeView, setActiveView] = useState(0)
    const [navOpen, setNavOpen] = useState(false)

    // ---------------------
    // Event handlers
    // ---------------------

    /**
     * @description A function which handles setting the active view.
     * @param {number} view - the view to be set as active
     * @returns void
     */  
    function handleSetActiveView(view) {
        setActiveView(view)
    }

    /**
     * @description A function which handles toggling the navigation pane.
     * @returns void  
     */
    function toggleNav() {
        setNavOpen(!navOpen)
    }

    // ---------------------
    // Render
    // ---------------------

    // conditional rendering based on the active view.
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