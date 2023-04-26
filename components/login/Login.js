import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground, Image, TextInput, Button, Text} from 'react-native'
import {api} from '../../settings'
import { stylesColors } from '../../styleObjects';

const Login = ({setToken}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false)
    const [loginFailed, setLoginFailed] = useState(false)
    
    useEffect(() => {
      console.log(loginFailed)
    }, [loginFailed])
    
    /**
     * A function which handles the login process
     */
    function handleLogin () {
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
            setLoginFailed(true)
            setTimeout(() => setLoginFailed(false), 3000)
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            const token = data.token
            setLoginLoading(false)
            setToken(token)
        })
        .catch((error) => {
            console.error(error)
        })
    }

    return (
        <ImageBackground source={require('../../assets/splash.png')} style={styles.container}>
            <View style={styles.section}>
                <Image style={styles.logo} source={require('../../assets/logo.png')} />
            </View>
            <View style={styles.section}>
              {loginFailed && <Text style={{
                backgroundColor: stylesColors.negativeBackgroundRed,
                color: "black",
                borderRadius: 3,
                borderColor: stylesColors.negativeBorderRed,
                padding: 20
              }}>Oops!  Login Failed - please try again</Text>}
                <View style={styles.inputWrapper}>
                    <TextInput style={styles.field} value={username} onChangeText={setUsername} inputMode="email" keyboardType="email-address" textAlign={"center"} placeholder={"Email Address"} autoFocus/>
                    <TextInput style={styles.field} value={password} onChangeText={setPassword} secureTextEntry={true} textAlign={"center"} placeholder={"Password"}/>
                    <Button style={styles.button} disabled={username.length === 0 || password.length === 0 || loginLoading } title={loginLoading ? "Loading" : "Login"} onPress={handleLogin}/>
                </View>
            </View>   
        </ImageBackground>
    )
}

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
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 5,
  },
  button: {
    borderRadius: 5,
  }
});

export default Login
