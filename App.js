import React, { useState, useEffect } from 'react'
import {View, StyleSheet} from 'react-native';
import Login from './components/login/Login.js';
import Home from './components/main/Home.js';
import { UserContext } from './contexts/UserContext';
import { UpdatesContextProvider } from './contexts/UpdatesContext.js';

import { getFromSecureStore } from './utils/secureStoreHelpers.js';
import { saveToSecureStore } from './utils/secureStoreHelpers.js';
import { deleteFromSecureStore } from './utils/secureStoreHelpers.js';

const App = () => {

  // ---------------------
  // State Declarations
  // ---------------------
  
  // auth token state.
  const [token, setToken] = useState(undefined)

  // ---------------------
  // UseEffects
  // ---------------------

  // on first load, check for an existing token and if it exists, set it's value in state.
  useEffect(() => {
    //check for existing token
    getFromSecureStore('secure_token').then(token => {
      try {
        setToken(token)
      }
      catch(err) {
        console.log(err)
      }
    });
  }, []) 

  // ---------------------
  // Event handlers
  // ---------------------

  /**
   * @description A function which handles a provided token
   * @param {string} token - the token to be saved
   * @returns void
   */
  function handleSetToken (token) {
    saveToSecureStore('secure_token', token).then(() => {
      try {
        setToken(token)
      }
      catch(err) {
        console.log(err)
      }
    })
  }

  /**
   * @description A function which handles logging out a user
   * @returns void
   */
  function handleLogOut() {
    deleteFromSecureStore().then(() => {
      try {
        setToken(undefined)
      }
      catch (err) {
        console.log(err)
      }
    })
  }

  // ---------------------
  // Return
  // ---------------------

  return (
    <UserContext.Provider value={{token: token, logOut: handleLogOut}} >
      <UpdatesContextProvider value={{deleted: undefined, updated: undefined}} >
        <View style={styles.container}>
          {/* if we have a token, show the home screen, otherwise show the login screen. */}
          {!token && <Login setToken={handleSetToken}/>}
          {token && <Home/>}
        </View>
      </UpdatesContextProvider>
    </UserContext.Provider>
  );
}

// ---------------------
// Style Definitions
// ---------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App
