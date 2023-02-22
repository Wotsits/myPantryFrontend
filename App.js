import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import {View, StyleSheet, Text} from 'react-native';
import Login from './components/login/Login.js';
import Home from './components/main/Home.js';
import * as SecureStore from 'expo-secure-store';
import { UserContext } from './contexts/UserContext';
import { UpdatesContextProvider } from './contexts/UpdatesContext.js';


async function getFromSecureStore(key) {
  return await SecureStore.getItemAsync(key)
} 

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

const App = () => {
  const [token, setToken] = useState(undefined)

  useEffect(() => {
    //check for existing token
    getFromSecureStore('secure_token').then(token => {
      setToken(token)
    });
  }, []) 

  function handleSetToken (token) {
    save('secure_token', token).then(() => {
      setToken(token)
    })
  }

  return (
    <UserContext.Provider value={{token: token}} >
      <UpdatesContextProvider value={{deleted: undefined, updated: undefined}} >
        <View style={styles.container}>
          {!token && <Login setToken={handleSetToken}/>}
          {token && <Home/>}
        </View>
      </UpdatesContextProvider>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App
