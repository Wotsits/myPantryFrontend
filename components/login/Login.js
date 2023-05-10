import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground, Image, TextInput, Button, ToastAndroid} from 'react-native'
import {api} from '../../settings'
import { stylesColors } from '../../styleObjects';

const Login = ({setToken}) => {

    // ---------------------
    // State Declarations
    // ---------------------

    const [username, setUsername] = useState("");
    const [usernameValid, setUsernameValid] = useState(false)
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false)

    // ---------------------
    // UseEffects
    // ---------------------

    // check if the username is valid each time it changes.
    useEffect(() => {
      const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      if (emailRegex.test(username)) {
        setUsernameValid(true)
      } else {
        setUsernameValid(false)
      }
    }, [username])

    // ---------------------
    // Event Handlers
    // ---------------------

    /**
     * @description A function which handles the login process
     * @returns void
     */
    function handleLogin () {
        // set the login loading state to true, set back to false when the fetch is complete.
        setLoginLoading(true)
        fetch(`${api}api-token-auth/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            setLoginLoading(false)
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // save the token to the local state and the secure storage.
            const token = data.token
            setToken(token)   
            setLoginLoading(false)        
        })
        .catch((error) => {
            ToastAndroid.show(`Login Failed - email address or password are incorrect.  Please try again. `, ToastAndroid.SHORT)
        })
    }

    // ---------------------
    // Render
    // ---------------------

    return (
        <ImageBackground source={require('../../assets/splash.png')} style={styles.container}>
            <View style={styles.section}>
                <Image style={styles.logo} source={require('../../assets/logo.png')} />
            </View>
            <View style={styles.section}>
                <View style={styles.inputWrapper}>
                    <TextInput style={styles.field} value={username} onChangeText={setUsername} inputMode="email" keyboardType="email-address" maxLength={255} autoCapitalize='none' textAlign={"center"} placeholder={"Email Address"} autoFocus/>
                    <TextInput style={styles.field} value={password} onChangeText={setPassword} secureTextEntry={true} textAlign={"center"} maxLength={255} autoCapitalize='none' placeholder={"Password"}/>
                    <Button style={styles.button} disabled={username.length === 0 || !usernameValid || password.length === 0 || loginLoading } title={loginLoading ? "Loading" : "Login"} onPress={handleLogin}/>
                </View>
            </View>   
        </ImageBackground>
    )
}

// ----------------
// Styles Definitions
// ----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flex: 1, 
    width: "100%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  logo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  inputWrapper: {
    flex: 1,
    width: "100%",
    paddingTop: "20%",
    paddingBottom: "20%",
    paddingRight: "10%",
    paddingLeft: "10%",
    justifyContent: "space-between"
  },
  field: {
    backgroundColor: stylesColors.lightBackground,
    paddingVertical: 10,
    borderRadius: 5,
  },
  button: {
    borderRadius: 5,
  }
});

export default Login
